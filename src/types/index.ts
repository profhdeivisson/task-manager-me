export type StageName = 'Planejamento' | 'A iniciar' | 'Em execução' | 'Validação' | 'Finalizados';

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
