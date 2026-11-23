import { PUZZLE_RESPONSE } from "@razzia/common/questions/puzzle"
import { ANSWERS_COLORS } from "@razzia/web/features/game/utils/constants"
import type { ResponsesComponentProps } from "@razzia/web/features/questions/types"
import clsx from "clsx"
import { Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"

const BADGE_CLASS =
  "flex items-center gap-2 rounded-xl px-4 py-2 text-xl font-bold text-white shadow-md"

const PuzzleResponses = ({
  data: { answers, responses },
}: ResponsesComponentProps) => {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-2">
      <div className="flex flex-wrap justify-center gap-3">
        <span className={clsx(BADGE_CLASS, "bg-correct")}>
          <Check className="size-6 stroke-4" />
          {t("game:puzzle.correct")}
          <span className="rounded-md bg-black/20 px-2">
            {responses[PUZZLE_RESPONSE.CORRECT] || 0}
          </span>
        </span>
        <span className={clsx(BADGE_CLASS, "bg-red-500")}>
          <X className="size-6 stroke-4" />
          {t("game:puzzle.incorrect")}
          <span className="rounded-md bg-black/20 px-2">
            {responses[PUZZLE_RESPONSE.INCORRECT] || 0}
          </span>
        </span>
      </div>

      <ol className="flex flex-col gap-2">
        {answers.map((answer, index) => (
          <li
            key={index}
            className={clsx(
              "flex items-center gap-3 rounded-2xl p-4 text-sm font-bold text-white drop-shadow-md md:text-lg",
              ANSWERS_COLORS[index % ANSWERS_COLORS.length],
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-black/20 md:size-9">
              {index + 1}
            </span>
            <p className="flex-1 wrap-break-word">{answer}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default PuzzleResponses
