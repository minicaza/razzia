import { MAX_ANSWERS, PUZZLE_MIN_ANSWERS } from "@razzia/common/constants"
import FieldError from "@razzia/web/components/forms/FieldError"
import { ANSWERS_COLORS } from "@razzia/web/features/game/utils/constants"
import {
  useQuizzEditor,
  type QuizzFormValues,
} from "@razzia/web/features/quizz/contexts/quizz-editor-context"
import clsx from "clsx"
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

const MOVE_BUTTON_CLASS =
  "flex size-6 items-center justify-center rounded-md bg-black/20 text-white hover:bg-black/30 disabled:opacity-30"

const PuzzleEditor = () => {
  const { currentQuestion, currentIndex, updateQuestion, questionPath } =
    useQuizzEditor()
  const { control } = useFormContext<QuizzFormValues>()
  const { t } = useTranslation()

  const { answers } = currentQuestion

  const addAnswer = () => {
    if (answers.length >= MAX_ANSWERS) {
      return
    }

    updateQuestion(currentIndex, { answers: [...answers, ""] })
  }

  const removeAnswer = () => {
    if (answers.length <= PUZZLE_MIN_ANSWERS) {
      return
    }

    updateQuestion(currentIndex, { answers: answers.slice(0, -1) })
  }

  const move = (from: number, to: number) => {
    const next = [...answers]

    next[from] = answers[to]
    next[to] = answers[from]
    updateQuestion(currentIndex, { answers: next })
  }

  return (
    <div className="z-10 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-muted-foreground bg-background rounded-lg px-2 py-1 text-sm font-semibold">
          {t("quizz:question.puzzle.hint")}
        </p>
        <div className="flex gap-2">
          <button
            onClick={removeAnswer}
            aria-label={t("quizz:removeAnswer")}
            disabled={answers.length <= PUZZLE_MIN_ANSWERS}
            className="bg-accent text-accent-foreground hover:bg-accent flex size-7 items-center justify-center rounded-lg disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={addAnswer}
            aria-label={t("quizz:addAnswer")}
            disabled={answers.length >= MAX_ANSWERS}
            className="bg-accent text-accent-foreground hover:bg-accent flex size-7 items-center justify-center rounded-lg disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <ol className="flex flex-col gap-3">
        {answers.map((_, i) => (
          <Controller
            key={i}
            control={control}
            name={questionPath(`answers.${i}`)}
            render={({ field, fieldState }) => (
              <li className="flex flex-col gap-1">
                <div
                  className={clsx(
                    "flex items-center gap-3 rounded-2xl px-4 py-5",
                    ANSWERS_COLORS[i % ANSWERS_COLORS.length],
                    fieldState.invalid && "ring-2 ring-red-500",
                  )}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-black/20 text-sm font-bold text-white md:size-8 md:text-base">
                    {i + 1}
                  </span>
                  <input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? `${field.name}-error` : undefined
                    }
                    className="w-full bg-transparent font-semibold text-white placeholder-white/70 outline-none drop-shadow-md"
                    placeholder={t("quizz:addAnswerPlaceholder")}
                  />
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      aria-label={t("quizz:question.puzzle.moveUp", {
                        position: i + 1,
                      })}
                      className={MOVE_BUTTON_CLASS}
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === answers.length - 1}
                      aria-label={t("quizz:question.puzzle.moveDown", {
                        position: i + 1,
                      })}
                      className={MOVE_BUTTON_CLASS}
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                </div>
                <FieldError
                  id={`${field.name}-error`}
                  errors={[fieldState.error]}
                  pill
                />
              </li>
            )}
          />
        ))}
      </ol>
    </div>
  )
}

export default PuzzleEditor
