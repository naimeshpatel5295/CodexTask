/**
 * Prisma Singleton Client
 * 
 * This file creates a single instance of PrismaClient that is shared across the app.
 * Using a singleton prevents multi-connection issues in Development environments
 * caused by "Hot Reloading" which would otherwise create many client instances.
 */

import { PrismaClient } from '@prisma/client'

// Function to create a new client instance
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Attach the client to the global scope (globalThis) in Development to persevere across reloads
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Export the singleton instance
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// If not in production, store the instance globally
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
