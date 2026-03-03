/**
 * Workspace-keyed dashboard metrics.
 * Replace with API calls when connecting a backend.
 */

export interface Stat {
  label: string;
  value: string;
  change?: string;
}

const metricsByWorkspace: Record<string, Stat[]> = {
  acme: [
    { label: 'Total Projects', value: '12', change: '+2 this month' },
    { label: 'Active Users', value: '48', change: '+5 this week' },
    { label: 'API Calls', value: '2.4k', change: '+12% vs last month' },
    { label: 'Uptime', value: '99.9%', change: 'Last 30 days' },
  ],
  startup: [
    { label: 'Total Projects', value: '4', change: '+1 this month' },
    { label: 'Active Users', value: '8', change: '+2 this week' },
    { label: 'API Calls', value: '340', change: '+25% vs last month' },
    { label: 'Uptime', value: '99.5%', change: 'Last 30 days' },
  ],
  'side-project': [
    { label: 'Total Projects', value: '1' },
    { label: 'Active Users', value: '1' },
    { label: 'API Calls', value: '42', change: 'Hobby usage' },
    { label: 'Uptime', value: '98%', change: 'Last 30 days' },
  ],
};

export function getMetrics(workspaceSlug: string): Stat[] {
  return metricsByWorkspace[workspaceSlug] ?? [];
}
