import caseMapData from '@/data/case-map.json';
import { getProjectById } from '@/data/projects';
import type { CaseMapPoint } from '@/types';

const points = caseMapData as readonly CaseMapPoint[];
const labelSides = new Set(['above', 'below', 'left', 'right']);

for (const point of points) {
  if (point.x < 0 || point.x > 100 || point.y < 0 || point.y > 100) {
    throw new Error(`Case map point "${point.id}" is outside the map`);
  }

  if (!labelSides.has(point.labelSide)) {
    throw new Error(`Case map point "${point.id}" has no valid label position`);
  }

  if (point.type === 'verified-case') {
    const project = getProjectById(point.projectId);
    if (!project || project.geography.precision === 'unspecified') {
      throw new Error(`Case map point "${point.id}" has no mappable project`);
    }
    if (project.geography.countryCode !== point.countryCode) {
      throw new Error(`Case map point "${point.id}" conflicts with project geography`);
    }
  }
}

export const caseMapPoints = points;
