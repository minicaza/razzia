import { MAX_ANSWERS, PUZZLE_MIN_ANSWERS } from "@razzia/common/constants"
import type { Question } from "@razzia/common/types/game"

export { default as AnswerComponent } from "@razzia/web/features/questions/puzzle/components/PuzzleAnswers"

export { default as ConfigComponent } from "@razzia/web/features/questions/puzzle/components/PuzzleConfig"

export { default as AnswersEditor } from "@razzia/web/features/questions/puzzle/components/PuzzleEditor"

export { default as ResponsesComponent } from "@razzia/web/features/questions/puzzle/components/PuzzleResponses"

export const labelKey = "quizz:questionType.puzzle"

// A puzzle has no right answer to pick: the order of its answers is the answer.
export const quizOnly = true

export const initialValues = ({ answers }: Question): Partial<Question> => ({
  answers: [
    ...answers,
    ...Array.from(
      { length: Math.max(0, PUZZLE_MIN_ANSWERS - answers.length) },
      () => "",
    ),
  ].slice(0, MAX_ANSWERS),
  solutions: undefined,
})
