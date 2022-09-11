import mongoose from 'mongoose';
import config from './index.js';

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true, //fix deprecation api
  useUnifiedTopology: true //fix deprecation api
});

mongoose.connection.on('connected', () => {
  console.log('Mongo DB success connection');
});
mongoose.connection.on('reconnected', () => {
  console.log('Mongo DB reconnected');
});
mongoose.connection.on('error', error => {
  console.log('Mongo DB error connection', error)
  mongoose.disconnect();
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongo DB disconnected');
});