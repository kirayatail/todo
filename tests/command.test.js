import { beforeEach, describe, expect, test, vi } from "vitest";
import { program } from "../src/command";

const todoMocks = vi.hoisted(() => ({
  show: vi.fn(),
  push: vi.fn(),
  cue: vi.fn(),
  list: vi.fn(),
  pop: vi.fn(),
  edit: vi.fn(),
}));
vi.mock("../src/todo.js", () => todoMocks);

const prgm = (str) => {
  const params = ["node index.js", str].join(" ").trim().split(" ");
  program.parse(params);
};

describe("Program", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("Default function", () => {
    prgm("");
    prgm("show");
    expect(todoMocks.show).toHaveBeenCalledTimes(2);
  });
  test("List", () => {
    prgm("list");
    prgm("ls");
    expect(todoMocks.list).toHaveBeenCalledTimes(2);
  });
  test("Cue", () => {
    prgm("cue test");
    expect(todoMocks.cue).toHaveBeenCalled();
  });
  test("Pop", () => {
    prgm("pop");
    prgm("done");
    expect(todoMocks.pop).toHaveBeenCalledTimes(2);
  });
  test("Edit", () => {
    prgm("edit");
    prgm("editor");
    prgm("open");
    expect(todoMocks.edit).toHaveBeenCalledTimes(3);
  });
  test("Push", () => {
    prgm("push test");
    expect(todoMocks.push.mock.calls[0]).toEqual(
      expect.arrayContaining(["test", {}])
    );
  });
  test("Push/Cue should exit when params are missing", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    const stdErrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => {});

    prgm("push");
    prgm("cue");

    expect(exitSpy).toHaveBeenCalledTimes(2);
    expect(stdErrSpy).toHaveBeenCalledWith(`error: missing required argument 'name'\n`);
  });
  test("Push multi param", () => {
    prgm("push test multiple words");
    expect(todoMocks.push.mock.calls[0]).toEqual(
      expect.arrayContaining(["test multiple words", {}])
    );
  });
  test("Push Next", () => {
    prgm("push -n test");
    expect(todoMocks.push.mock.calls[0]).toEqual(
      expect.arrayContaining(["test", { next: true }])
    );
  });
});
