import { describe, test, expect, vi } from "vitest";
import fs from "node:fs";
import { file, filename } from "../file";

const fsMock = vi.hoisted(() => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

fsMock.default.existsSync.mockImplementation(() => true);

vi.mock("node:fs", () => fsMock);
const writeSpy = vi.spyOn(fs, "writeFileSync");

describe("File", () => {
  test("filter out empty rows", () => {
    fsMock.default.readFileSync.mockImplementationOnce(
      () => `

apa

bepa


`
    );

    file((x) => x);

    expect(writeSpy).toHaveBeenCalledWith(filename,`apa
bepa`);
  });
});
