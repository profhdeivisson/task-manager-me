export const STAGE_NAMES = ['Planejamento', 'A iniciar', 'Em execução', 'Validação', 'Finalizados'] as const;

export type StageName = typeof STAGE_NAMES[number];

export interface Card {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
}

export interface Stage {
  id: string;
  name: StageName;
  cards: Card[];
  collapsed: boolean;
}

export interface Project {
  id: string;
  name: string;
  stages: Stage[];
  createdAt: Date;
}
