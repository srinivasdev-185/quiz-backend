import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    chapterName:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
},{timestamps:true})
const topicSchema = new mongoose.Schema({
   topicName:{
    type:String,
    required:true
   } ,
   createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true
   },
   chapter:{
    type:mongoose.Types.ObjectId,
    ref:'Chapter',
     required:true,
   },
},{timestamps:true})
const quizSchema=new mongoose.Schema({
    quizName:{
        type:String,
        required:true,
    },
    topicName:{
        type:mongoose.Types.ObjectId,
        ref:'Topic',
        required:true
    },
    createdBy:{
        type:String,
        ref:'User',
    },
},{timestamps:true})
const questionSchema =new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    quiz:{
        type:mongoose.Types.ObjectId,
        ref:'Quiz',
        required:true
    },
    options:{
        type:[String],
        required:true
     },
     correctAnswer:Number
           
},{timestamps:true})
const attemptQuiz=new mongoose.Schema({
    quiz:{
        type:mongoose.Types.ObjectId,
        ref:'Quiz',
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    answers:{
        type:Map,
        of: Number,
        required:true
    }
})

export const chapter= mongoose.model('Chapter',chapterSchema);
export const topic=mongoose.model('Topic',topicSchema);
export const quiz=mongoose.model('Quiz',quizSchema);
export const Question=mongoose.model('Question',questionSchema);
export const AttemptQuiz=mongoose.model('AttemptQuiz',attemptQuiz);