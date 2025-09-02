import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import type { Stage as StageType } from '../types';
import Card from './Card';

interface StageProps {
  stage: StageType;
  onAddCard: () => void;
  onToggleCollapse: () => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
}

const Stage: React.FC<StageProps> = ({
  stage,
  onAddCard,
  onToggleCollapse,
  onEditCard,
  onDeleteCard,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });
  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 p-4 rounded-lg min-w-64 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-slate-800">{stage.name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={onToggleCollapse}
            className="bg-gray-100 text-gray-600 p-0"
          >
            {stage.collapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
          <button onClick={onAddCard} className="text-gray-600 bg-gray-100 p-0">
            <FaPlus />
          </button>
        </div>
      </div>
      {!stage.collapsed && (
        <div className="space-y-2">
          {stage.cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onEdit={onEditCard ? () => onEditCard(card.id) : undefined}
              onDelete={onDeleteCard ? () => onDeleteCard(card.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Stage;
