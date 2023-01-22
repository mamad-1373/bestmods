import { z } from "zod";
import { router, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server"

export const modViewRouter = router({
    incModViewCnt: publicProcedure
        .input(z.object({
            url: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.mod.update({
                    where: {
                        url: input.url
                    },
                    data: {
                        totalViews: {
                            increment: 1
                        }
                    }
                });
            } catch (error) {
                throw new TRPCError({
                    message: error,
                    code: "BAD_REQUEST"
                });
            }
        }),
        addModUniqueView: publicProcedure
            .input(z.object({
                userId: z.string(),
                modId: z.number()
            }))
            .mutation(async ({ ctx, input}) => {
                try {
                    await ctx.prisma.modUniqueView.create({
                        data: {
                            modId: input.modId,
                            userId: input.userId
                        }
                    });
                } catch (error) {
                    if (error.includes("constraint"))
                        return;

                    throw new TRPCError({
                        message: error,
                        code: "BAD_REQUEST"
                    });
                }
            })
});