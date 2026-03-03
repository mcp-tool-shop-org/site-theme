/**
 * Workspace-keyed activity feed.
 * Replace with API calls when connecting a backend.
 */

export interface ActivityRow {
  event: string;
  user: string;
  time: string;
}

const activityByWorkspace: Record<string, ActivityRow[]> = {
  acme: [
    { event: 'Deployed v2.1.0', user: 'alice@example.com', time: '2 min ago' },
    { event: 'Updated settings', user: 'bob@example.com', time: '15 min ago' },
    { event: 'Created project', user: 'carol@example.com', time: '1 hour ago' },
    { event: 'Invited team member', user: 'alice@example.com', time: '3 hours ago' },
    { event: 'Upgraded to Pro', user: 'dave@example.com', time: 'Yesterday' },
  ],
  startup: [
    { event: 'Pushed to main', user: 'founder@startup.io', time: '30 min ago' },
    { event: 'Created project', user: 'founder@startup.io', time: '2 hours ago' },
  ],
  'side-project': [
    { event: 'Initial commit', user: 'me@example.com', time: '1 week ago' },
  ],
};

export function getActivity(workspaceSlug: string): ActivityRow[] {
  return activityByWorkspace[workspaceSlug] ?? [];
}
