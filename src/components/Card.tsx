import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Card as CardType } from '../types';
import { useDraggable } from '@dnd-kit/core';

interface CardProps {
  card: CardType;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Card: React.FC<CardProps> = ({ card, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded shadow cursor-grab active:cursor-grabbing transition-opacity relative group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-slate-800 flex-1 pr-2">{card.title}</h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-blue-500 hover:text-blue-700 p-1"
              title="Editar tarefa"
            >
              <FaEdit size={12} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-500 hover:text-red-700 p-1"
              title="Excluir tarefa"
            >
              <FaTrash size={12} />
            </button>
          )}
        </div>
      </div>
      {card.description && (
        <p className="text-sm text-gray-600">{card.description}</p>
      )}
    </div>
  );
};

export default Card;
