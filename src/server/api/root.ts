import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { calendarRouter } from "./routers/calendar";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  calendar: calendarRouter,
});

export type AppRouter = typeof appRouter; 