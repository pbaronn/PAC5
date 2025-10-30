const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB Atlas:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };