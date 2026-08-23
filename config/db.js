import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('🔴 Error: MONGO_URI is not defined in your .env file!');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas Successfully!');

    // Cleanup legacy email index automatically if present
    const usersCollection = mongoose.connection.collections['users'];
    if (usersCollection) {
      const indexes = await usersCollection.indexes();
      if (indexes.some((idx) => idx.name === 'email_1')) {
        await usersCollection.dropIndex('email_1');
        console.log('🗑️ Legacy index "email_1" dropped.');
      }
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;