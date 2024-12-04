import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: null | {
      connection: typeof mongoose;
    };
    promise: null | Promise<{
      connection: typeof mongoose;
    }>;
  };
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToMongoDB() {
  try {
    if (global.mongoose.conn) {
      return global.mongoose.conn.connection;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    if (!global.mongoose.promise) {
      global.mongoose.promise = mongoose
        .connect(process.env.MONGODB_URI, {
          bufferCommands: false,
        })
        .then((mongoose) => ({
          connection: mongoose,
        }));
    }

    const conn = await global.mongoose.promise;
    global.mongoose.conn = conn;

    return conn.connection;
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
    global.mongoose.promise = null;
    throw e;
  }
}
