import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Button from "@razzia/web/components/Button"
import { ANSWERS_COLORS } from "@razzia/web/features/game/utils/constants"
import type { AnswerComponentProps } from "@razzia/web/features/questions/types"
import clsx from "clsx"
import { GripVertical } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface PieceProps {
  position: number
  label: string
  large?: boolean
}

const PIECE_CLASS =
  "flex items-center gap-3 rounded-2xl p-4 text-left text-sm font-bold text-white drop-shadow-md md:text-lg"

const Piece = ({ label, large }: Omit<PieceProps, "position">) => (
  <>
    <p className={clsx("flex-1 wrap-break-word", large && "md:text-2xl")}>
      {label}
    </p>
    <GripVertical
      aria-hidden
      className={clsx("shrink-0 opacity-80", large ? "size-7" : "size-6")}
    />
  </>
)

const SortablePiece = ({ position, label, large }: PieceProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: position })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={clsx(
        PIECE_CLASS,
        "cursor-grab touch-none select-none active:cursor-grabbing",
        ANSWERS_COLORS[position % ANSWERS_COLORS.length],
        isDragging && "relative z-10 shadow-xl",
        large && "py-6",
      )}
    >
      <Piece label={label} large={large} />
    </li>
  )
}

const PuzzleAnswers = ({
  answers,
  onSubmit,
  readOnly,
  fill,
}: AnswerComponentProps) => {
  const [order, setOrder] = useState(() => answers.map((_, index) => index))
  const { t } = useTranslation()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return
    }

    setOrder((current) =>
      arrayMove(
        current,
        current.indexOf(Number(active.id)),
        current.indexOf(Number(over.id)),
      ),
    )
  }

  // The server expects the shown positions, from the first piece to the last.
  const handleSubmit = () => onSubmit(order)

  return (
    <div
      className={clsx(
        "mx-auto mb-4 flex w-full max-w-3xl flex-col gap-3 px-2",
        { "flex-1 justify-center": fill },
      )}
    >
      {readOnly ? (
        <ol className="flex flex-col gap-2">
          {order.map((position) => (
            <li
              key={position}
              className={clsx(
                PIECE_CLASS,
                ANSWERS_COLORS[position % ANSWERS_COLORS.length],
              )}
            >
              <Piece label={answers[position]} />
            </li>
          ))}
        </ol>
      ) : (
        <>
          <p className="text-center text-sm font-bold text-white drop-shadow-md md:text-lg">
            {t("game:puzzle.hint")}
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={order}
              strategy={verticalListSortingStrategy}
            >
              <ol className="flex flex-col gap-2">
                {order.map((position) => (
                  <SortablePiece
                    key={position}
                    position={position}
                    label={answers[position]}
                    large={fill}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
          <Button
            onClick={handleSubmit}
            className="mx-auto w-full max-w-xs shadow-md"
          >
            {t("game:confirm")}
          </Button>
        </>
      )}
    </div>
  )
}

export default PuzzleAnswers
