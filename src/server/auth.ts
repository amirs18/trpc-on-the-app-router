import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import auth0Provider from "next-auth/providers/auth0";
import z from 'zod'


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  secret:process.env.AUTH0_SECRET,
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    auth0Provider({
      clientId: z.string().parse(process.env.AUTH0_CLIENT_ID),
      clientSecret: z.string().parse(process.env.AUTH0_CLIENT_SECRET),
      issuer:process.env.AUTH0_ISSUER_BASE_URL,
      
    }),
    /**
     * ...add more providers here.
    *
    * Most other providers require a bit more work than the Discord provider. For example, the
    * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
    * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
    *
    * @see https://next-auth.js.org/providers/github
    */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};
