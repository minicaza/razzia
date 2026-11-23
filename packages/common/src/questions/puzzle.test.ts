import {
  isCorrectPuzzleOrder,
  PUZZLE_RESPONSE,
} from "@razzia/common/questions/puzzle"
import { describe, expect, it } from "vitest"

describe("isCorrectPuzzleOrder", () => {
  it("accepts the answers listed from first to last", () => {
    expect(isCorrectPuzzleOrder([0, 1, 2], 3)).toBe(true)
    expect(isCorrectPuzzleOrder([0, 1, 2, 3], 4)).toBe(true)
  })

  it.each([
    [[1, 0, 2], 3],
    [[2, 1, 0], 3],
    [[0, 1], 3],
    [[0, 1, 2, 3], 3],
    [[0, 0, 0], 3],
    [[], 3],
  ])("rejects %j out of %d pieces", (answerIds, total) => {
    expect(isCorrectPuzzleOrder(answerIds, total)).toBe(false)
  })
})

describe("PUZZLE_RESPONSE", () => {
  it("uses two different slots", () => {
    expect(PUZZLE_RESPONSE.CORRECT).not.toBe(PUZZLE_RESPONSE.INCORRECT)
  })
})
