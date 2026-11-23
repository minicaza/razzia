import { QUESTION_TYPES } from "@razzia/common/constants"
import { isCorrectPuzzleOrder } from "@razzia/common/questions/puzzle"
import type { Question } from "@razzia/common/types/game"
import type { ScoringFn } from "@razzia/socket/services/scoring"

export const type = QUESTION_TYPES.PUZZLE

export const scoring: ScoringFn = (
  question: Question,
  answerIds: number[],
): number => (isCorrectPuzzleOrder(answerIds, question.answers.length) ? 1 : 0)
