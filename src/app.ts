/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import morgan from 'morgan';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/route';
import sendResponse from './app/utils/sendResponse';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['*'] }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

// application routes
app.use('/api/v1', router);

// app.get('/', test);
app.get('/', (req, res) => {
  res.json({
    message: 'API Service is Running!',
    author: 'Monir Hossain',
    github: 'monir6163',
    web: 'https://monirhossain.vercel.app',
  });
});
app.get('/result', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://btebresultszone.com/api/results/individual?roll=814704&exam=DIPLOMA+IN+ENGINEERING&regulation=2022',
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Result fetched successfully',
      data: data,
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
});
app.use(globalErrorHandler);
//Not Found
app.use(notFound);

//  export app
export default app;
