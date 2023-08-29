import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server";


export const serverClient = appRouter.createCaller({session:null});
