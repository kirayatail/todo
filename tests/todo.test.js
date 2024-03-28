import { describe, test, expect, vi, beforeEach } from "vitest";
import { cue, edit, list, pop, push, show } from "../src/todo";
import * as open from "../src/open";
import * as file from "../src/file";

const fileMocks = vi.hoisted(() => ({
  file: vi.fn(),
  filename: vi.fn()
}));
const openMock = vi.hoisted(() => ({
  open: vi.fn(),
}));
const processMock = vi.hoisted(() => ({
  exec: vi.fn(),
}))

vi.mock("../src/file.js", () => fileMocks);
vi.mock("../src/open.js", () => openMock);
vi.mock("node:child_process", () => processMock);

const logSpy = vi.spyOn(global.console, "log");
const openSpy = vi.spyOn(open, "open");

describe("Todo functions", () => {
  beforeEach(() => vi.resetAllMocks());
  describe("File", () => {
    test("file mocking", () => {
      fileMocks.file.mockImplementation((fn) => {
        fn(["First item", "Second item"]);
      });

      show();

      expect(logSpy).toHaveBeenCalledWith("First item");
    });
  });
  describe("Show/List", () => {
    test("Show prints even on empty list", () => {
      fileMocks.file.mockImplementation((fn) => {
        fn([]);
      });

      show();

      expect(logSpy).toHaveBeenCalledWith(
        "A blissful silence slowly propagates through your mind"
      );
    });
    test("Show prints first item", () => {
      fileMocks.file.mockImplementation((fn) => {
        fn(["First item", "Second item"]);
      });

      show();

      expect(logSpy).toHaveBeenCalledWith("First item");
    });
    test("List prints even on empty list", () => {
      fileMocks.file.mockImplementation((fn) => {
        fn([]);
      });

      list();

      expect(logSpy).toHaveBeenCalledWith("*");
    });
    test("List prints all items", () => {
      fileMocks.file.mockImplementation((fn) => {
        fn(["First item", "Second item"]);
      });

      list();

      expect(logSpy).toHaveBeenCalledWith("First item\nSecond item");
    });
  });

  describe("Push/Cue", () => {
    test("Regular push, new item first and printed", () => {
      let result = ["First item", "Second item"];
      fileMocks.file.mockImplementation((fn) => {
        result = fn(result);
      });

      push("Top priority", { next: false });

      expect(logSpy).toHaveBeenCalledWith("Top priority");
      expect(result).toEqual(["Top priority", "First item", "Second item"]);
    });
    test("Placing item next in line", () => {
      let result = ["First item", "Second item"];
      fileMocks.file.mockImplementation((fn) => {
        result = fn(result);
      });

      push("Do next", { next: true });

      expect(logSpy).toHaveBeenCalledWith("First item");
      expect(result).toEqual(["First item", "Do next", "Second item"]);
    });
    test("Placing item next last in list", () => {
      let result = ["First item", "Second item"];
      fileMocks.file.mockImplementation((fn) => {
        result = fn(result);
      });

      cue("Do next");

      expect(logSpy).toHaveBeenCalledWith("First item");
      expect(result).toEqual(["First item", "Second item", "Do next"]);
    });
  });

  describe("Pop", () => {
    test("Pop with more items in list", () => {
      let result = ["Done item", "Second item"];
      fileMocks.file.mockImplementation((fn) => {
        result = fn(result);
      });

      pop();

      expect(logSpy).toHaveBeenCalledWith("Second item");
      expect(result).toEqual(["Second item"]);
    });
    test("Pop with one item in list", () => {
      let result = ["Done item"];
      fileMocks.file.mockImplementation((fn) => {
        result = fn(result);
      });

      pop();

      expect(logSpy).toHaveBeenCalledWith(
        "A blissful silence slowly propagates through your mind"
      );
      expect(result).toEqual([]);
    });
    test("Pop with no items in list", () => {
      let result = [];
      fileMocks.file.mockImplementation((fn) => {
        result = fn(result);
      });

      pop();

      expect(logSpy).toHaveBeenCalledWith(
        "A blissful silence slowly propagates through your mind"
      );
      expect(result).toEqual([]);
    });
  });

  describe('Edit', () => {
    test('Edit without editor set', () => {
      let result = '';
      vi.stubEnv('EDITOR', '')
      vi.spyOn(file, 'filename', 'get').mockReturnValue('testpath');
      openMock.open.mockImplementation((path) => {
        result = path;
      })
      edit();
      
      expect(result).toBe('testpath')
    });
    test('Edit with editor set', () => {
      let result = '';
      vi.stubEnv('EDITOR', 'myFavEditor')
      vi.spyOn(file, 'filename', 'get').mockReturnValue('testpath');
      processMock.exec.mockImplementation((command) => {
        result = command;
      })
      
      edit();
      
      expect(result).toBe('${EDITOR} testpath')
    });
  })
});
