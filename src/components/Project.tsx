import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import type { Card, Project as ProjectType } from '../types';

import Stage from './Stage';

interface FormData {
  title: string;
  description: string;
}

interface ProjectProps {
  project: ProjectType;
  onProjectUpdate: (project: ProjectType) => void;
}

const Project: React.FC<ProjectProps> = ({ project, onProjectUpdate }) => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const handleAddCard = async (stageId: string) => {
    const { value: formValues } = await Swal.fire({
      title: 'Nova Tarefa',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Título">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Descrição"></textarea>',
      focusConfirm: false,
      preConfirm: () => {
        const title = (
          document.getElementById('swal-input1') as HTMLInputElement
        ).value;
        const description = (
          document.getElementById('swal-input2') as HTMLTextAreaElement
        ).value;
        if (!title) {
          Swal.showValidationMessage('Título é obrigatório');
          return false;
        }
        return { title, description };
      },
    });

    if (formValues) {
      const newCard: Card = {
        id: Date.now().toString(),
        title: formValues.title,
        description: formValues.description,
        createdAt: new Date(),
      };
      const newProject = { ...project };
      const stage = newProject.stages.find(s => s.id === stageId);
      if (stage) {
        stage.cards.push(newCard);
        onProjectUpdate(newProject);
      }
    }
  };

  const handleToggleCollapse = (stageId: string) => {
    const newProject = { ...project };
    const stage = newProject.stages.find(s => s.id === stageId);
    if (stage) {
      stage.collapsed = !stage.collapsed;
      onProjectUpdate(newProject);
    }
  };

  const handleEditCard = async (cardId: string) => {
    // Find the card to edit
    let cardToEdit: Card | null = null;
    let stageIndex = -1;
    let cardIndex = -1;

    project.stages.forEach((stage, sIndex) => {
      const cIndex = stage.cards.findIndex(c => c.id === cardId);
      if (cIndex !== -1) {
        cardToEdit = stage.cards[cIndex] as Card;
        stageIndex = sIndex;
        cardIndex = cIndex;
      }
    });

    if (!cardToEdit) return;

    const currentTitle = (cardToEdit as Card).title;
    const currentDescription = (cardToEdit as Card).description || '';

    const { value } = await Swal.fire({
      title: 'Editar Tarefa',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Título" value="' +
        currentTitle +
        '">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Descrição">' +
        currentDescription +
        '</textarea>',
      focusConfirm: false,
      preConfirm: () => {
        const title = (
          document.getElementById('swal-input1') as HTMLInputElement
        ).value;
        const description = (
          document.getElementById('swal-input2') as HTMLTextAreaElement
        ).value;
        if (!title) {
          Swal.showValidationMessage('Título é obrigatório');
          return false;
        }
        return { title, description };
      },
    });

    if (value) {
      const formData = value as FormData;
      const newProject = { ...project };
      const card = newProject.stages[stageIndex].cards[cardIndex];
      card.title = formData.title;
      card.description = formData.description;
      onProjectUpdate(newProject);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const result = await Swal.fire({
      title: 'Excluir Tarefa',
      text: 'Tem certeza que deseja excluir esta tarefa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const newProject = { ...project };
      newProject.stages.forEach(stage => {
        stage.cards = stage.cards.filter(card => card.id !== cardId);
      });
      onProjectUpdate(newProject);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const cardId = active.id as string;

    // Find the card being dragged
    for (const stage of project.stages) {
      const card = stage.cards.find(c => c.id === cardId);
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Find source and destination stages
    let sourceStageIndex = -1;
    let destinationStageIndex = -1;
    let cardIndex = -1;

    project.stages.forEach((stage, stageIdx) => {
      const cardIdx = stage.cards.findIndex(c => c.id === cardId);
      if (cardIdx !== -1) {
        sourceStageIndex = stageIdx;
        cardIndex = cardIdx;
      }
      if (stage.id === overId) {
        destinationStageIndex = stageIdx;
      }
    });

    if (sourceStageIndex === -1 || destinationStageIndex === -1) return;

    const newProject = { ...project };
    const sourceStage = newProject.stages[sourceStageIndex];
    const destinationStage = newProject.stages[destinationStageIndex];
    const [movedCard] = sourceStage.cards.splice(cardIndex, 1);
    destinationStage.cards.push(movedCard);

    onProjectUpdate(newProject);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Find source and destination stages
    let sourceStageIndex = -1;
    let destinationStageIndex = -1;
    let cardIndex = -1;

    project.stages.forEach((stage, stageIdx) => {
      const cardIdx = stage.cards.findIndex(c => c.id === cardId);
      if (cardIdx !== -1) {
        sourceStageIndex = stageIdx;
        cardIndex = cardIdx;
      }
      if (stage.id === overId) {
        destinationStageIndex = stageIdx;
      }
    });

    if (sourceStageIndex === -1 || destinationStageIndex === -1) return;

    // If dropping on the same stage, do nothing
    if (sourceStageIndex === destinationStageIndex) return;

    const newProject = { ...project };
    const sourceStage = newProject.stages[sourceStageIndex];
    const destinationStage = newProject.stages[destinationStageIndex];
    const [movedCard] = sourceStage.cards.splice(cardIndex, 1);
    destinationStage.cards.push(movedCard);

    onProjectUpdate(newProject);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div>
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          {project.name}
        </h1>
        <div
          className="flex space-x-4 overflow-x-auto h-[650px] h-max-[650px] pb-4"
          onMouseDown={e => {
            const container = e.currentTarget as HTMLDivElement & {
              isDragging?: boolean;
              startX?: number;
              scrollLeftStart?: number;
            };
            container.isDragging = true;
            container.startX = e.pageX - container.offsetLeft;
            container.scrollLeftStart = container.scrollLeft;
          }}
          onMouseLeave={e => {
            const container = e.currentTarget as HTMLDivElement & {
              isDragging?: boolean;
            };
            container.isDragging = false;
          }}
          onMouseUp={e => {
            const container = e.currentTarget as HTMLDivElement & {
              isDragging?: boolean;
            };
            container.isDragging = false;
          }}
          onMouseMove={e => {
            const container = e.currentTarget as HTMLDivElement & {
              isDragging?: boolean;
              startX?: number;
              scrollLeftStart?: number;
            };
            if (!container.isDragging) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - container.startX!) * 2; // scroll-fast
            container.scrollLeft = container.scrollLeftStart! - walk;
          }}
        >
          {project.stages.map(stage => (
            <Stage
              key={stage.id}
              stage={stage}
              onAddCard={() => handleAddCard(stage.id)}
              onToggleCollapse={() => handleToggleCollapse(stage.id)}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <h3 className="font-semibold text-gray-800">{activeCard.title}</h3>
            {activeCard.description && (
              <p className="text-sm text-gray-600 mt-2">
                {activeCard.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Project;
