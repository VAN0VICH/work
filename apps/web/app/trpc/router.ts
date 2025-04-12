import type { TRPCRouterRecord } from '@trpc/server';
import { db } from '@work-profile/db';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from './init';



const entityRouter = {
  list: publicProcedure.query(async () => {
    const entities = await db.query.entity.findMany()
    return entities
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const entity = await db.query.entity.findFirst({
        where:(entities, {eq})=>eq(entities.id, input.id)
      })

      return entity;
    }),
} satisfies TRPCRouterRecord;


export const trpcRouter = createTRPCRouter({
  entity: entityRouter,
});
export type TRPCRouter = typeof trpcRouter;