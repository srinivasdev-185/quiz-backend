import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoute from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import quizRoute from './routes/quiz.route.js'
import { verifyToken } from './middlewares/auth.midleware.js';

const app=express();
dotenv.config();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',authRoute);

app.use(verifyToken);
app.use('/quiz',quizRoute);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('mongodb conncted successfully');
}).catch((error)=>{
    console.error('mongo connectiron error',error);
})
app.listen(process.env.PORT,()=>{
    console.log('app listen on port',process.env.PORT);
})