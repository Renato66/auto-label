import { describe, test, expect } from "bun:test";
import { validate } from './validate'
describe("Testing validate inputs", () => {
  test("should throw an error on missing fields", () => {
    expect(() => validate()).toThrow(/No token set, Issue undefined/)
  });
});