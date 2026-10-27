import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Vlog_platform'
    );
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    // Don't kill process immediately in dev so developers can see error and start mongod
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Warning] Disconnected from database');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB Info] Reconnected to database');
});

export default connectDB;
