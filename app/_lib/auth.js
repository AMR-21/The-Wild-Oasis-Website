import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },

    async signIn({ user }) {
      try {
        const guest = await getGuest(user?.email);

        if (!guest)
          await createGuest({
            email: user?.email,
            fullName: user?.name,
          });

        return true;
      } catch {
        return false;
      }
    },

    async session({ session }) {
      const guest = await getGuest(session?.user?.email);

      session.user.guestId = guest?.id;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
