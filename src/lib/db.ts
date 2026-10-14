import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .catch(async (primaryError) => {
        // If demo/placeholder credentials or local network, fall back to active local MongoDB instance
        if (process.env.NODE_ENV !== 'production' || MONGODB_URI?.includes('Custom78')) {
          console.warn(
            `Primary MONGODB_URI failed (${primaryError.message}). Connecting to local MongoDB at mongodb://127.0.0.1:27017/solar_shop...`
          );
          return mongoose.connect('mongodb://127.0.0.1:27017/solar_shop', opts);
        }
        throw primaryError;
      })
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
