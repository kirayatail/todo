import { open } from "./open.js";
import { exec } from "node:child_process";
import { file, filename } from "./file.js";

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
    if (opts?.next) {
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
