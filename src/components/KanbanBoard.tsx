"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, X, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

export type KanbanCard = {
  id: string;
  statusId: string;
  title: string;
  meta?: string;
  dateLabel?: string;
  tag?: string;
  description?: string;
  thumbnailUrl?: string | null;
};

export type KanbanStatus = { id: string; name: string };

type KanbanBoardProps = {
  statuses: KanbanStatus[];
  cards: KanbanCard[];
  onMove?: (cardId: string, toStatusId: string) => void;
  onAddStatus?: (name: string) => void;
  onRenameStatus?: (statusId: string, name: string) => void;
  onDeleteStatus?: (statusId: string) => void;
  onAddCard?: (statusId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  onCardClick?: (card: KanbanCard) => void;
};

export default function KanbanBoard({
  statuses,
  cards,
  onMove,
  onAddStatus,
  onRenameStatus,
  onDeleteStatus,
  onAddCard,
  onDeleteCard,
  onCardClick,
}: KanbanBoardProps) {
  const [items, setItems] = useState(cards);
  const [addingStatus, setAddingStatus] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Keep local card list in sync when the server-provided list changes (e.g. after add/delete)
  if (cards !== items && cards.length !== items.length) {
    setItems(cards);
  }

  function handleDragEnd(result: DropResult) {
    const { draggableId, destination } = result;
    if (!destination) return;
    const toStatusId = destination.droppableId;
    setItems((prev) => prev.map((c) => (c.id === draggableId ? { ...c, statusId: toStatusId } : c)));
    onMove?.(draggableId, toStatusId);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="brand-scroll flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <Droppable droppableId={status.id} key={status.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
              >
                <div className="group flex items-center justify-between px-1">
                  {renamingId === status.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => {
                        if (renameValue.trim()) onRenameStatus?.(status.id, renameValue.trim());
                        setRenamingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                      className="w-full rounded-glass-sm border border-alc-rose bg-white/80 px-2 py-1 text-sm font-semibold outline-none"
                    />
                  ) : (
                    <h3 className="text-sm font-semibold text-ink dark:text-white">{status.name}</h3>
                  )}
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setRenamingId(status.id);
                        setRenameValue(status.name);
                      }}
                      className="rounded-full p-1 text-muted hover:bg-alc-pink/20 hover:text-ink"
                    >
                      <PencilSimple size={13} weight="bold" />
                    </button>
                    <button
                      onClick={() => onDeleteStatus?.(status.id)}
                      className="rounded-full p-1 text-muted hover:bg-alc-rose/20 hover:text-alc-rose"
                    >
                      <Trash size={13} weight="bold" />
                    </button>
                  </div>
                  <span className="ml-1 text-xs text-muted group-hover:hidden">
                    {items.filter((i) => i.statusId === status.id).length}
                  </span>
                </div>

                {items
                  .filter((i) => i.statusId === status.id)
                  .map((card, index) => (
                    <Draggable draggableId={card.id} index={index} key={card.id}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          onClick={() => onCardClick?.(card)}
                          className="editable-card glass-card cursor-pointer p-3 active:cursor-grabbing"
                        >
                          {onDeleteCard && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCard(card.id);
                              }}
                              className="card-delete-btn"
                              aria-label="Remove"
                            >
                              <X size={13} weight="bold" />
                            </button>
                          )}
                          {card.thumbnailUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={card.thumbnailUrl} alt="" className="mb-2 h-24 w-full rounded-glass-sm object-cover" />
                          )}
                          <p className="text-sm font-medium text-ink">{card.title}</p>
                          {card.meta && <p className="mt-0.5 text-xs text-muted">{card.meta}</p>}
                          <div className="mt-2 flex items-center justify-between text-xs">
                            {card.dateLabel && (
                              <span className="text-muted">
                                {new Date(card.dateLabel).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                            )}
                            {card.tag && (
                              <span className="rounded-full bg-alc-gradient px-2 py-0.5 font-medium text-white">
                                {card.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}

                <button
                  onClick={() => onAddCard?.(status.id)}
                  className="flex items-center justify-center gap-1.5 rounded-glass-sm border border-dashed border-alc-pink py-2 text-xs font-medium text-alc-rose hover:bg-alc-pink/10"
                >
                  <Plus size={14} weight="bold" /> Add card
                </button>
              </div>
            )}
          </Droppable>
        ))}

        <div className="w-72 shrink-0">
          {addingStatus ? (
            <div className="glass-panel flex flex-col gap-2 p-3">
              <input
                autoFocus
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                placeholder="Status name"
                className="rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm outline-none focus:border-alc-rose"
              />
              <button
                className="btn-gradient text-sm"
                onClick={() => {
                  if (newStatusName.trim()) onAddStatus?.(newStatusName.trim());
                  setNewStatusName("");
                  setAddingStatus(false);
                }}
              >
                Add column
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingStatus(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-glass-lg border-2 border-dashed border-alc-pink py-3 text-sm font-medium text-alc-rose hover:bg-alc-pink/10"
            >
              <Plus size={16} weight="bold" /> Add status
            </button>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
