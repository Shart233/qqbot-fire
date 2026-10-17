import { createSocket } from "node:dgram";
import { SystemClock } from "./clock.js";
export type NtpOptions = {
  port?: number;
  timeoutMs?: number;
  now?: () => number;
  signal?: AbortSignal;
};
const epochOffset = 2208988800;
function timestamp(buffer: Buffer, index: number, unix: number) {
  const seconds = Math.floor(unix / 1000) + epochOffset;
  buffer.writeUInt32BE(seconds >>> 0, index);
  buffer.writeUInt32BE(Math.floor(((unix % 1000) / 1000) * 2 ** 32), index + 4);
}
function parseTimestamp(buffer: Buffer, index: number, near: number) {
  const seconds = buffer.readUInt32BE(index);
  const fraction = buffer.readUInt32BE(index + 4) / 2 ** 32;
  const nearestEra = Math.round(
    (near / 1000 + epochOffset - seconds) / 2 ** 32,
  );
  return (seconds + nearestEra * 2 ** 32 - epochOffset + fraction) * 1000;
}
export function queryNtpOffset(
  host: string,
  options: NtpOptions = {},
): Promise<number> {
  return new Promise((resolve, reject) => {
    const socket = createSocket("udp4");
    let done = false,
      connected = false;
    let sentAt = 0;
    const request = Buffer.alloc(48);
    request[0] = 0x23;
    const finish = (error?: Error, value?: number) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", cancel);
      try {
        socket.close();
      } catch {
        /* 尚未建立 UDP 句柄时无需关闭。 */
      }
      if (error) reject(error);
      else resolve(value!);
    };
    const cancel = () => finish(new Error("SNTP 校时已取消"));
    const timer = setTimeout(
      () => finish(new Error("SNTP 校时超时")),
      options.timeoutMs ?? 3000,
    );
    socket.on("error", (error) => finish(error));
    socket.on("message", (packet) => {
      if (!connected || done) return;
      const receivedAt = (options.now ?? Date.now)();
      if (
        packet.length < 48 ||
        (packet[0]! & 7) !== 4 ||
        packet[0]! >>> 6 === 3 ||
        packet[1] === 0 ||
        packet[1]! > 15
      ) {
        finish(new Error("SNTP 响应状态非法"));
        return;
      }
      if (!packet.subarray(24, 32).equals(request.subarray(40, 48))) {
        finish(new Error("SNTP 原始时间戳不匹配"));
        return;
      }
      const receive = parseTimestamp(packet, 32, sentAt),
        transmit = parseTimestamp(packet, 40, sentAt);
      if (
        !packet.subarray(40, 48).some((byte) => byte !== 0) ||
        transmit < receive
      ) {
        finish(new Error("SNTP 服务器时间非法"));
        return;
      }
      finish(undefined, (receive - sentAt + (transmit - receivedAt)) / 2);
    });
    options.signal?.addEventListener("abort", cancel, { once: true });
    if (options.signal?.aborted) {
      cancel();
      return;
    }
    // connect 使 UDP 只接收已配置服务器的回应，避免错误来源包改变调度时间。
    socket.connect(options.port ?? 123, host, () => {
      if (done) return;
      connected = true;
      sentAt = (options.now ?? Date.now)();
      timestamp(request, 40, sentAt);
      socket.send(request, (error) => {
        if (error) finish(error);
      });
    });
  });
}
export class CalibratedClock extends SystemClock {
  lastSync = 0;
  server = "";
  private readonly cancel = new AbortController();
  private synchronization: Promise<boolean> | undefined;
  private timer: ReturnType<typeof setInterval> | undefined;
  constructor(
    private readonly servers = [
      "ntp.aliyun.com",
      "ntp.tencent.com",
      "cn.pool.ntp.org",
      "time.windows.com",
    ],
  ) {
    super();
  }
  sync(): Promise<boolean> {
    if (this.synchronization) return this.synchronization;
    const work = (async () => {
      for (const server of this.servers) {
        if (this.cancel.signal.aborted) return false;
        try {
          this.offset = await queryNtpOffset(server, {
            signal: this.cancel.signal,
          });
          this.server = server;
          this.lastSync = Date.now();
          return true;
        } catch {
          /* 网络不可用时继续尝试后备服务器，保留上次校准值。 */
        }
      }
      return false;
    })();
    this.synchronization = work;
    void work.finally(() => {
      this.synchronization = undefined;
    });
    return work;
  }
  start(onSync: () => void) {
    if (this.timer) return;
    void this.sync().then(() => {
      if (!this.cancel.signal.aborted) onSync();
    });
    this.timer = setInterval(() => {
      void this.sync().then(() => {
        if (!this.cancel.signal.aborted) onSync();
      });
    }, 3600_000);
  }
  async close() {
    this.cancel.abort();
    if (this.timer) clearInterval(this.timer);
    await this.synchronization;
  }
}
