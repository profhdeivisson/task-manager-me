import { supabase } from '../lib/supabase';
import type { Project, Card } from '../types';

export const saveProjects = async (projects: Project[]): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .upsert(projects.map(project => ({
      id: project.id,
      name: project.name,
      stages: project.stages,
      created_at: project.createdAt.toISOString(),
    })));

  if (error) {
    console.error('Error saving projects:', error);
    throw error;
  }
};

export const loadProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error);
    return [];
  }

  return (data || []).map(project => ({
    id: project.id,
    name: project.name,
    stages: project.stages,
    createdAt: new Date(project.created_at),
  }));
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const createInitialProject = (name: string): Project => {
  const stageNames: ('Planejamento' | 'A iniciar' | 'Em execução' | 'Validação' | 'Finalizados')[] =
    ['Planejamento', 'A iniciar', 'Em execução', 'Validação', 'Finalizados'];

  const stages = stageNames.map((name) => ({
    id: name.toLowerCase().replace(' ', '-'),
    name,
    cards: [] as Card[],
    collapsed: false,
  }));

  return {
    id: Date.now().toString(),
    name,
    stages,
    createdAt: new Date(),
  };
};
