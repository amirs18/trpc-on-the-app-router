import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "./auth";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {

  const session = await getServerAuthSession();
  return { session };
}
export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // Infers that the `session` is non-nullable
      session: ctx.session,
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const priveteProcedure = t.procedure.use(isAuthenticated);
