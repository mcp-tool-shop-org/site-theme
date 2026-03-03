/**
 * Workspace-keyed project data.
 * Replace with API calls when connecting a backend.
 */

export interface Project {
  id: string;
  name: string;
  status: string;
  updated: string;
}

const projectsByWorkspace: Record<string, Project[]> = {
  acme: [
    { id: '1', name: 'Marketing Site', status: 'Active', updated: '2 hours ago' },
    { id: '2', name: 'API Gateway', status: 'Active', updated: '1 day ago' },
    { id: '3', name: 'Mobile App', status: 'Draft', updated: '3 days ago' },
  ],
  startup: [
    { id: '1', name: 'Landing Page', status: 'Active', updated: '5 hours ago' },
    { id: '2', name: 'MVP Backend', status: 'Draft', updated: '2 days ago' },
  ],
  'side-project': [
    { id: '1', name: 'Weekend Hack', status: 'Draft', updated: '1 week ago' },
  ],
};

export function listProjects(workspaceSlug: string): Project[] {
  return projectsByWorkspace[workspaceSlug] ?? [];
}

export function getProject(workspaceSlug: string, id: string): Project | undefined {
  return listProjects(workspaceSlug).find((p) => p.id === id);
}

/** Returns all valid workspace×id pairs for getStaticPaths(). */
export function getAllProjectParams(): Array<{ workspace: string; id: string }> {
  return Object.entries(projectsByWorkspace).flatMap(([ws, projects]) =>
    projects.map((p) => ({ workspace: ws, id: p.id }))
  );
}
