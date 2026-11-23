import { createQuestion } from "@razzia/socket/test/fixtures"
import { normalizeFilename } from "@razzia/socket/utils/file"
import {
  createPuzzleOrder,
  orderToPoint,
  timeToPoint,
} from "@razzia/socket/utils/game"
import { createNickname } from "@razzia/socket/utils/nickname"
import { afterEach, describe, expect, it, vi } from "vitest"

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("createPuzzleOrder", () => {
  it.each([2, 3, 4])("shuffles %d pieces without losing any", (total) => {
    const order = createPuzzleOrder(total)

    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: total }, (_, index) => index),
    )
  })

  it("never hands out the solved order", () => {
    // A shuffle that keeps the order would otherwise be returned as is
    vi.spyOn(Math, "random").mockReturnValue(0.5)

    for (let run = 0; run < 50; run += 1) {
      expect(createPuzzleOrder(4)).not.toEqual([0, 1, 2, 3])
    }
  })

  it("actually varies the order", () => {
    const seen = new Set(
      Array.from({ length: 60 }, () => createPuzzleOrder(4).join(",")),
    )

    expect(seen.size).toBeGreaterThan(5)
  })
})

describe("orderToPoint", () => {
  it("gives full points to the first and half to the last player", () => {
    expect(orderToPoint(0, 3)).toBe(1000)
    expect(orderToPoint(1, 3)).toBe(750)
    expect(orderToPoint(2, 3)).toBe(500)
  })

  it("gives full points to a lone player", () => {
    expect(orderToPoint(0, 1, 200)).toBe(200)
  })
})

describe("timeToPoint", () => {
  it("decreases the points with the time spent answering", () => {
    vi.useFakeTimers()

    const question = createQuestion({ time: 10, maxPoints: 2000 })
    const start = Date.now()

    expect(timeToPoint(start, question)).toBe(2000)

    vi.advanceTimersByTime(5000)

    expect(timeToPoint(start, question)).toBe(1000)

    vi.advanceTimersByTime(10_000)

    expect(timeToPoint(start, question)).toBe(0)
  })
})

describe("createNickname", () => {
  it("adds a suffix when every generated name is taken", () => {
    vi.spyOn(Math, "random").mockReturnValue(0)

    expect(createNickname([])).toBe("Brave Badger")
    expect(createNickname(["Brave Badger", "Brave Badger 2"])).toBe(
      "Brave Badger 3",
    )
  })
})

describe("normalizeFilename", () => {
  it("builds a safe slug followed by a random id", () => {
    expect(normalizeFilename("Élève Été!", { fallback: "x" })).toMatch(
      /^eleve-ete-[\w-]{8}$/u,
    )
  })

  it("falls back when nothing usable is left", () => {
    expect(normalizeFilename("../../", { fallback: "quizz" })).toMatch(
      /^quizz-[\w-]{8}$/u,
    )
  })
})

describe("GAME_SPEED", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("speeds up every game delay", async () => {
    vi.resetModules()
    vi.stubEnv("GAME_SPEED", "10")

    const { SECOND_MS } = await import("@razzia/socket/utils/sleep")

    expect(SECOND_MS).toBe(100)
  })

  it("keeps real seconds by default", async () => {
    vi.resetModules()

    const { SECOND_MS } = await import("@razzia/socket/utils/sleep")

    expect(SECOND_MS).toBe(1000)
  })

  it("refuses an invalid speed", async () => {
    vi.resetModules()
    vi.stubEnv("GAME_SPEED", "0")

    await expect(import("@razzia/socket/env")).rejects.toThrow(
      "GAME_SPEED must be a positive number",
    )
  })
})
