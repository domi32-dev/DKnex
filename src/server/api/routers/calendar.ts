import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const calendarRouter = createTRPCRouter({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.calendarEvent.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: "asc",
      },
    });
  }),

  createEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.date(),
        time: z.string().optional(),
        color: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.calendarEvent.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.calendarEvent.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
}); 