import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: {
      id: string
      name: string
      email: string
      firstName: string
      lastName: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    firstName: string
    lastName: string
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    firstName: string
    lastName: string
  }
}