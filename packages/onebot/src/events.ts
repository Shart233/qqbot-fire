import type { MessageSegment } from "./models.js";
type Raw = Record<string, unknown>;
const object = (value: unknown): Raw =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Raw)
    : {};
export class EventView {
  constructor(readonly raw: Raw) {}
  getRaw() {
    return this.raw;
  }
  private text(key: string) {
    return this.raw[key] == null ? "" : String(this.raw[key]);
  }
  private number(key: string) {
    const value = Number(this.raw[key] ?? 0);
    if (!Number.isSafeInteger(value))
      throw new Error("事件标识符或时间不是安全整数");
    return value;
  }
  getTime() {
    return this.number("time");
  }
  getSelfId() {
    return this.number("self_id");
  }
  getPostType() {
    return this.text("post_type");
  }
  getMessageType() {
    return this.text("message_type");
  }
  getSubType() {
    return this.text("sub_type");
  }
  getMessageId() {
    return this.number("message_id");
  }
  getUserId() {
    return this.number("user_id");
  }
  getGroupId() {
    return this.number("group_id");
  }
  getRawMessage() {
    return this.text("raw_message");
  }
  getFont() {
    return this.number("font");
  }
  getMessage(): MessageSegment[] {
    return Array.isArray(this.raw.message)
      ? this.raw.message.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            typeof item.type === "string" &&
            item.data &&
            typeof item.data === "object",
        )
      : [];
  }
  getSender() {
    return object(this.raw.sender);
  }
  getSenderNickname() {
    return String(this.getSender().nickname ?? "");
  }
  getSenderCard() {
    return String(this.getSender().card ?? "");
  }
  getSenderRole() {
    return String(this.getSender().role ?? "");
  }
  getDisplayName() {
    return this.getSenderCard() || this.getSenderNickname();
  }
  getNoticeType() {
    return this.text("notice_type");
  }
  getOperatorId() {
    return this.number("operator_id");
  }
  getTargetId() {
    return this.number("target_id");
  }
  getDuration() {
    return this.text("duration");
  }
  getRequestType() {
    return this.text("request_type");
  }
  getComment() {
    return this.text("comment");
  }
  getFlag() {
    return this.text("flag");
  }
  getMetaEventType() {
    return this.text("meta_event_type");
  }
  isMessage() {
    return this.getPostType() === "message";
  }
  isNotice() {
    return this.getPostType() === "notice";
  }
  isRequest() {
    return this.getPostType() === "request";
  }
  isMetaEvent() {
    return this.getPostType() === "meta_event";
  }
  isPrivateMessage() {
    return this.isMessage() && this.getMessageType() === "private";
  }
  isGroupMessage() {
    return this.isMessage() && this.getMessageType() === "group";
  }
  isFromAdmin() {
    return ["admin", "owner"].includes(this.getSenderRole());
  }
  isFromOwner() {
    return this.getSenderRole() === "owner";
  }
  getPlainText() {
    return this.getMessage()
      .filter((item) => item.type === "text")
      .map((item) => String(item.data.text ?? ""))
      .join("");
  }
  hasAt(id: number) {
    return this.getMessage().some(
      (item) => item.type === "at" && String(item.data.qq) === String(id),
    );
  }
}
export type EventHandler = (event: EventView) => boolean | Promise<boolean>;
export class EventDispatcher {
  private readonly handlers: EventHandler[] = [];
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly onError: (error: unknown) => void = () => {}) {}
  addHandler(handler: EventHandler) {
    this.handlers.push(handler);
    return () => this.removeHandler(handler);
  }
  removeHandler(handler: EventHandler) {
    const index = this.handlers.indexOf(handler);
    if (index >= 0) this.handlers.splice(index, 1);
  }
  hasHandlers() {
    return this.handlers.length > 0;
  }
  dispatch(raw: Raw): Promise<boolean> {
    const work = this.queue
      .catch(() => {})
      .then(async () => {
        const event = new EventView(raw);
        for (const handler of [...this.handlers])
          try {
            if (await handler(event)) return true;
          } catch (error) {
            this.onError(error);
          }
        return false;
      });
    this.queue = work;
    return work;
  }
  async close() {
    this.handlers.length = 0;
    await this.queue.catch(() => {});
  }
}
