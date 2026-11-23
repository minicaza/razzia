/**
 * The manager receives `responses[PUZZLE_RESPONSE.CORRECT]` players who put
 * the pieces in the right order and `responses[PUZZLE_RESPONSE.INCORRECT]`
 * who did not, instead of a count per answer.
 */
export const PUZZLE_RESPONSE = { CORRECT: 0, INCORRECT: 1 } as const

/**
 * A puzzle stores its answers in the right order, so a submission is correct
 * when it lists every answer index from first to last.
 */
export const isCorrectPuzzleOrder = (
  answerIds: number[],
  total: number,
): boolean =>
  answerIds.length === total && answerIds.every((id, index) => id === index)
