import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          email: credentials.email,
          password: credentials.password,
        });

        if (data.status === "success") {
          const { user, tokenYek } = data;
          user.tokenYek = tokenYek;
          return user;
        }

        if (data.status === "not-verified") {
          // if email is not verified, return custom error
          return Promise.reject(new Error("CredentialsSigninEmailNotVerified"));
        }

        return null;
      },
    }),
    // ...add more providers here
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1, // 1 day
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, user: session.user };
      }

      if (user) token.user = user;
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
