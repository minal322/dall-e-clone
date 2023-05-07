import mongoose from 'mongoose';

const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(url)
    .then(() => console.log('connected to mongodb Database'))
    .catch((err) => {
      console.log('failed to connect with mongo');
      console.error(err);
    });
};

export default connectDB;