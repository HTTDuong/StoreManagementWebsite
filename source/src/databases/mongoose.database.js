import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DB_SERVER

try {
  await mongoose.connect(uri);

  console.log('Connected MongoDB:', uri);
}
catch (err) {
  console.log('Can\'t connect MongoDB:', uri);
}

export { mongoose }