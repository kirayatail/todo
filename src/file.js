import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const filename = path.join(os.homedir(), "todo.txt");

if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, "");
}

export const file = (fn) => {
  const list = fs
    .readFileSync(filename, "utf-8")
    .trim()
    .split(/[\r\n]+/)
    .filter((i) => i !== "");
  const newList = fn(list);
  fs.writeFileSync(filename, newList.join("\n"));
};