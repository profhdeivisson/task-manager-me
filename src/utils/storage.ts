import type { Project, Stage, StageName } from '../types';

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem('projects', JSON.stringify(projects, (_key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
};

export const loadProjects = (): Project[] => {
  const data = localStorage.getItem('projects');
  if (!data) return [];
  return JSON.parse(data, (_key, value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  });
};

export const createInitialProject = (name: string): Project => {
  const stageNames: StageName[] = ['Planejamento', 'A iniciar', 'Em execução', 'Validação', 'Finalizados'];
  const stages: Stage[] = stageNames.map((name) => ({
    id: name.toLowerCase().replace(' ', '-'),
    name,
    cards: [],
    collapsed: false,
  }));
  return {
    id: Date.now().toString(),
    name,
    stages,
    createdAt: new Date(),
  };
};
