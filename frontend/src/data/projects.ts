import projectsData from '@/data/projects.json';
import type { CaseImage, Project } from '@/types';

export const projects = projectsData as readonly Project[];

const projectsById = new Map(projects.map((project) => [project.id, project]));

export function getProjectById(id: string | null): Project | undefined {
  return id === null ? undefined : projectsById.get(id);
}

export function getPrimaryProjectImage(project: Project): CaseImage {
  const image = project.featuredImage ?? project.images[0];
  if (!image) {
    throw new Error(`Project "${project.id}" has no images`);
  }

  return image;
}
