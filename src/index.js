import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import postsRoutes from './routes/postsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import adminsRoutes from './routes/adminsRoutes.js';

/* Creating an instance of the express application. */
const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

/* A middleware that logs all requests to the console. */
app.use(morgan('dev'));

//cors configuration
const whitelist = [process.env.FRONTEND_URL];

/* A function that checks if the origin is in the whitelist. */
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Cors error'));
    }
  },
};

/* A middleware that enables cors. */
//app.use(cors(corsOptions));

app.use('/api/v1', postsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/admins', adminsRoutes);

/* Telling the server to listen on port ?. */
app.listen(PORT, () => {
  console.log(`Listening ${PORT}`);
});
