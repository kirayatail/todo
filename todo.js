import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import open from 'open';
import { exec } from "node:child_process";

const filename = path.join(os.homedir(), "todo.txt");

if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, "");
}

const file = (fn) => {
  const list = fs
    .readFileSync(filename, "utf-8")
    .trim()
    .split(/[\r\n]+/)
    .filter((i) => i !== "");
  const newList = fn(list);
  fs.writeFileSync(filename, newList.join("\n"));
};

export const show = () => {
  file((list) => {
    if (list.length === 0) {
      console.log("A blissful silence slowly propagates through your mind");
    } else {
      console.log(list[0]);
    }
    return list;
  });
};
export const push = (name, opts) => {
  file((list) => {
    if (opts.next) {
      const first = list[0];
      const rest = list.slice(1);
      return [first, name, ...rest];
    }
    return [name, ...list];
  });
  show();
};
export const cue = (name) => {
  file((list) => {
    return [...list, name];
  });
  show();
};
export const pop = () => {
  file((list) => {
    return list.slice(1);
  });
  show();
};
export const list = () => {
  file((list) => {
    if (list.length === 0) {
      console.log("*");
    } else {
      console.log(list.join("\n"));
    }
    return list;
  });
};
export const edit = () => {
  if (process.env.EDITOR) {
    exec(`\$\{EDITOR\} ${filename}`);
  } else {
    open(filename);
  }
};
