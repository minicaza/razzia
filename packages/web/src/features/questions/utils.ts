import { MIN_ANSWERS, QUESTION_TYPES } from "@razzia/common/constants"
import { estimationAccuracy } from "@razzia/common/questions/estimation"
import { isEstimationOptions } from "@razzia/common/questions/options"
import { isCorrectPuzzleOrder } from "@razzia/common/questions/puzzle"
import type { Question } from "@razzia/common/types/game"

export const choiceInitialValues = (question: Question): Partial<Question> => {
  if (question.answers.length < MIN_ANSWERS) {
    return { answers: ["", ""], solutions: [0] }
  }

  // Coming from a puzzle, which keeps no solutions
  if (!question.solutions?.length) {
    return { solutions: [0] }
  }

  return {}
}

export const isAnswerCorrect = (
  question: Question,
  answerIds: number[] | null,
): boolean => {
  const { solutions, options } = question

  if (question.type === QUESTION_TYPES.PUZZLE) {
    return (
      answerIds !== null &&
      isCorrectPuzzleOrder(answerIds, question.answers.length)
    )
  }

  if (!answerIds || !solutions) {
    return false
  }

  if (isEstimationOptions(options)) {
    const value = answerIds.at(0)
    const solution = solutions.at(0)

    return (
      value !== undefined &&
      solution !== undefined &&
      estimationAccuracy(value, solution, options.margin) > 0
    )
  }

  return answerIds.some((id) => solutions.includes(id))
}
