import mongoose from "mongoose";

const globalCache = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local.");
  }

  if (!globalCache.mongooseConnection) {
    globalCache.mongooseConnection = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "saas",
      serverSelectionTimeoutMS: 5_000,
    });
  }

  return globalCache.mongooseConnection;
}
