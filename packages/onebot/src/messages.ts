import type { MessageSegment } from "./models.js";
import { safeId } from "./index.js";
const optional = (values: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(values).filter(([, value]) => value != null),
  );
const segment = (
  type: string,
  data: Record<string, unknown> = {},
): MessageSegment => ({ type, data });
export const Segments = {
  of: segment,
  text: (text: string) => segment("text", { text }),
  at: (id: number) => segment("at", { qq: String(safeId(id)) }),
  atAll: () => segment("at", { qq: "all" }),
  face: (id: number) => segment("face", { id: String(safeId(id)) }),
  image: (file: string, type?: string | null, url?: string | null) =>
    segment("image", optional({ file, type, url })),
  record: (file: string) => segment("record", { file }),
  video: (file: string) => segment("video", { file }),
  reply: (id: number) => segment("reply", { id: String(safeId(id)) }),
  json: (data: string) => segment("json", { data }),
  xml: (data: string) => segment("xml", { data }),
  markdown: (content: string) => segment("markdown", { content }),
  poke: (type: number, id: number) =>
    segment("poke", { type: String(safeId(type)), id: String(safeId(id)) }),
  dice: () => segment("dice"),
  rps: () => segment("rps"),
  location: (
    lat: number,
    lon: number,
    title?: string | null,
    content?: string | null,
  ) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon))
      throw new Error("经纬度必须为有限数字");
    return segment(
      "location",
      optional({ lat: String(lat), lon: String(lon), title, content }),
    );
  },
  music: (type: string, id: string) => segment("music", { type, id }),
  customMusic: (
    url: string,
    audio: string,
    title: string,
    content?: string | null,
    image?: string | null,
  ) =>
    segment(
      "music",
      optional({ type: "custom", url, audio, title, content, image }),
    ),
  file: (file: string, name?: string | null) =>
    segment("file", optional({ file, name })),
  node: (id: number, nickname?: string, content?: unknown) =>
    nickname === undefined
      ? segment("node", { id: String(safeId(id)) })
      : segment("node", { user_id: String(safeId(id)), nickname, content }),
  contact: (type: string, id: number) =>
    segment("contact", { type, id: String(safeId(id)) }),
};
export class MessageBuilder {
  private readonly parts: MessageSegment[] = [];
  static create() {
    return new MessageBuilder();
  }
  add(part: MessageSegment) {
    this.parts.push(structuredClone(part));
    return this;
  }
  text(text: string) {
    return this.add(Segments.text(text));
  }
  at(id: number) {
    return this.add(Segments.at(id));
  }
  atAll() {
    return this.add(Segments.atAll());
  }
  face(id: number) {
    return this.add(Segments.face(id));
  }
  image(file: string) {
    return this.add(Segments.image(file));
  }
  record(file: string) {
    return this.add(Segments.record(file));
  }
  video(file: string) {
    return this.add(Segments.video(file));
  }
  reply(id: number) {
    return this.add(Segments.reply(id));
  }
  json(data: string) {
    return this.add(Segments.json(data));
  }
  markdown(content: string) {
    return this.add(Segments.markdown(content));
  }
  poke(type: number, id: number) {
    return this.add(Segments.poke(type, id));
  }
  dice() {
    return this.add(Segments.dice());
  }
  rps() {
    return this.add(Segments.rps());
  }
  location(
    lat: number,
    lon: number,
    title?: string | null,
    content?: string | null,
  ) {
    return this.add(Segments.location(lat, lon, title, content));
  }
  music(type: string, id: string) {
    return this.add(Segments.music(type, id));
  }
  file(file: string, name?: string | null) {
    return this.add(Segments.file(file, name));
  }
  node(id: number, nickname: string, content: unknown) {
    return this.add(Segments.node(id, nickname, content));
  }
  build() {
    return structuredClone(this.parts);
  }
  toJson() {
    return JSON.stringify(this.parts);
  }
  toString() {
    return this.toJson();
  }
}
