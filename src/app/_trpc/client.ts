import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server";
import { getSession } from "next-auth/react";

export const trpc = createTRPCReact<AppRouter>();
