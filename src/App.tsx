import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { SiPolymerproject } from 'react-icons/si';
import ProjectComponent from './components/Project';
import ProjectList from './components/ProjectList';
import type { Project } from './types';
import { loadProjects, saveProjects } from './utils/supabaseStorage';

function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedProjects = await loadProjects();
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadData();
  }, []);

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
  };

  const handleProjectUpdate = async (project: Project) => {
    try {
      const updatedProjects = projects.map(p =>
        p.id === project.id ? project : p
      );
      setProjects(updatedProjects);
      await saveProjects(updatedProjects);
      setCurrentProject(project);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Project List Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="mb-4 text-white"
          >
            ✕ Fechar
          </button>
          <ProjectList
            projects={projects}
            setProjects={setProjects}
            onProjectSelect={project => {
              handleProjectSelect(project);
              setIsMobileMenuOpen(false);
            }}
            selectedProjectId={currentProject ? currentProject.id : null}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto">
          <ProjectList
            projects={projects}
            setProjects={setProjects}
            onProjectSelect={handleProjectSelect}
            selectedProjectId={currentProject ? currentProject.id : null}
          />
        </div>
        <div className="w-3/4 pt-4 ps-4 overflow-y-auto flex flex-col">
          {currentProject ? (
            <div className="flex-grow overflow-x-auto">
              <ProjectComponent
                project={currentProject}
                onProjectUpdate={handleProjectUpdate}
              />
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-20 h-screen flex items-center justify-center">
              Selecione um projeto para ver as etapas
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-screen flex flex-col">
        {/* Mobile Header with Hamburger Menu */}
        <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
          <h1 className="text-lg font-semibold text-slate-800 flex gap-2 items-center">
            <SiPolymerproject />
            <span>Gerenciamento de Tarefas</span>
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Mobile Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentProject ? (
            <div className="p-4">
              <ProjectComponent
                project={currentProject}
                onProjectUpdate={handleProjectUpdate}
              />
            </div>
          ) : (
            <div className="text-gray-500 text-center h-full flex items-center justify-center px-4 h-screen">
              <div>
                <p className="text-xl mb-4">
                  Bem-vindo ao Gerenciamento de Tarefas
                </p>
                <p>Clique no menu ☰ para ver seus projetos</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
