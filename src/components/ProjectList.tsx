import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SiPolymerproject } from 'react-icons/si';
import Swal from 'sweetalert2';
import type { Project } from '../types';
import { createInitialProject, saveProjects, deleteProject } from '../utils/supabaseStorage';

interface ProjectListProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onProjectSelect: (project: Project) => void;
  selectedProjectId?: string | null;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  setProjects,
  onProjectSelect,
  selectedProjectId,
}) => {
  const handleCreateProject = async () => {
    const result = await Swal.fire({
      title: 'Novo Projeto',
      input: 'text',
      inputLabel: 'Nome do projeto',
      inputPlaceholder: 'Digite o nome do projeto',
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value: string) => {
        if (!value) {
          return 'Nome é obrigatório!';
        }
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        const projectName = result.value as string;
        const newProject = createInitialProject(projectName);
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        onProjectSelect(newProject);
      } catch (error) {
        console.error('Error creating project:', error);
        Swal.fire('Erro', 'Não foi possível criar o projeto.', 'error');
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header fixo - Logo e botão de criar */}
      <div className="flex-shrink-0">
        <h1 className="hidden md:flex text-2xl font-bold mb-4 text-slate-800 flex gap-2 items-center">
          <SiPolymerproject />
          <span>Gerenciamento de Tarefas</span>
        </h1>
        <button
          onClick={handleCreateProject}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
        >
          Criar Novo Projeto
        </button>
      </div>

      {/* Lista de projetos com rolagem */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pr-2">
          {projects.map(project => (
            <div
              key={project.id}
              className={`bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow flex justify-between items-start group ${
                selectedProjectId === project.id ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div onClick={() => onProjectSelect(project)} className="flex-1">
                <h2 className="text-xl font-semibold text-slate-800">
                  {project.name}
                </h2>
                <p className="text-gray-600">
                  Criado em: {project.createdAt.toLocaleDateString()}
                </p>
                <p className="text-gray-600">Etapas: {project.stages.length}</p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={async e => {
                    e.stopPropagation();
                    const { value: newName } = await Swal.fire({
                      title: 'Renomear Projeto',
                      input: 'text',
                      inputLabel: 'Novo nome do projeto',
                      inputValue: project.name,
                      showCancelButton: true,
                      confirmButtonText: 'Salvar',
                      cancelButtonText: 'Cancelar',
                      inputValidator: (value: string) => {
                        if (!value) {
                          return 'Nome é obrigatório!';
                        }
                      },
                    });
                    if (newName && newName !== project.name) {
                      const updatedProjects = projects.map(p =>
                        p.id === project.id ? { ...p, name: newName } : p
                      );
                      setProjects(updatedProjects);
                      onProjectSelect({ ...project, name: newName });
                      try {
                        await saveProjects(updatedProjects);
                      } catch (error) {
                        console.error('Error saving project rename:', error);
                        Swal.fire('Erro', 'Não foi possível salvar a alteração.', 'error');
                      }
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Renomear Projeto"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={async e => {
                    e.stopPropagation();
                    const result = await Swal.fire({
                      title: 'Excluir Projeto',
                      text: 'Tem certeza que deseja excluir este projeto?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Sim, excluir',
                      cancelButtonText: 'Cancelar',
                    });
                if (result.isConfirmed) {
                  const updatedProjects = projects.filter(
                    p => p.id !== project.id
                  );
                  setProjects(updatedProjects);
                  if (selectedProjectId === project.id) {
                    onProjectSelect(undefined as unknown as Project);
                  }
                  try {
                    await deleteProject(project.id);
                  } catch (error) {
                    console.error('Error deleting project:', error);
                    Swal.fire('Erro', 'Não foi possível excluir o projeto.', 'error');
                  }
                }
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Excluir Projeto"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
