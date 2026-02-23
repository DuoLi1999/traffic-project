import fs from "fs";
import path from "path";

const STORE_ROOT = path.resolve(process.cwd(), "..", "store");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function entityDir(entity: string): string {
  const dir = path.join(STORE_ROOT, entity);
  ensureDir(dir);
  return dir;
}

export function readItem<T>(entity: string, id: string): T | null {
  const filePath = path.join(entityDir(entity), `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeItem<T extends { id: string }>(entity: string, item: T): T {
  const filePath = path.join(entityDir(entity), `${item.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf-8");
  return item;
}

export function listItems<T>(entity: string): T[] {
  const dir = entityDir(entity);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    return JSON.parse(raw) as T;
  });
}

export function deleteItem(entity: string, id: string): boolean {
  const filePath = path.join(entityDir(entity), `${id}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function queryItems<T>(entity: string, filter: (item: T) => boolean): T[] {
  return listItems<T>(entity).filter(filter);
}
