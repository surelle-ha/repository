// Re-export from Drizzle schema so pages/components use one source of truth
export type { ProjectRow as Project, ProjectInsert, ProjectInsert as ProjectUpdate } from '~/server/db/schema'
