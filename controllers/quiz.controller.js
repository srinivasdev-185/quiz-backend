import { createQuizes } from "../services/quiz.service.js"
import { responseMidleWare } from "../services/resMidleWare.js";
import { createQuestions, getDashBoardData } from "../services/quiz.service.js";
import { Question } from "../models/chaptre.model.js";
import { chapter } from "../models/chaptre.model.js";
import { topic, quiz } from "../models/chaptre.model.js";
import { AttemptQuiz } from "../models/chaptre.model.js";
export const createQuiz = async (req, res) => {
   try {
      console.log(req);
      let data = await createQuizes(req.body, req.user);
      console.log(data);
      return responseMidleWare(res, true, 'quiz created Successfully', data, 201)
   }
   catch (e) {
      console.log(e.message)
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const createQuestion = async (req, res) => {
   const data = await createQuestions(req.body);
   try {
      return responseMidleWare(res, true, 'quesion created successfully', data, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const getQuestionsOfQuiz = async (req, res) => {
   try {
      console.log(req.query.id, 'params');
      let data = await Question.find({ quiz: req.query.id });
      return responseMidleWare(res, true, 'question get Sucessfully', data, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const updateQuestion = async (req, res) => {
   try {
      const { question, options, quiz, correctAnswer, _id } = req.body;

      console.log(question, options, correctAnswer, _id)
      const questions = await Question.findOneAndUpdate({ _id: _id }, {
         $set: {
            question,
            options,
            correctAnswer,
         },
      },
         {
            new: true
         })
      console.log(questions)
      return responseMidleWare(res, true, 'question updated Sucessfully', questions, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const getDashboardData = async (req, res) => {
   try {
      let data = await getDashBoardData();
      return responseMidleWare(res, true, 'dashboard Data Fetch Successfully', data, 201);
   } catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const addChpater = async (req, res) => {
   try {
      const { chapterName } = req.body;
      const user = req.user;
      console.log('ffff', chapterName, user, req.body)
      const chapters = await chapter.create({
         chapterName: chapterName,
         createdBy: user.id,
      })
      console.log(chapters, 'chapters')
      return responseMidleWare(res, true, 'chapter created successfully', chapters, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const addTopic = async (req, res) => {
   try {
      const { topicName, chapterId } = req.body;
      const user = req.user;
      console.log('ffff', topicName, user, chapterId, req.body)
      const topics = await topic.create({
         topicName: topicName,
         chapter: chapterId,
         createdBy: user.id,
      })
      return responseMidleWare(res, true, 'topic created successfully', topics, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const addQuiz = async (req, res) => {
   try {
      const { quizName, topicId } = req.body;
      const user = req.user;
      console.log('ffff', quizName, user, topicId, req.body)
      const quizes = await quiz.create({
         quizName: quizName,
         topicName: topicId,
         createdBy: user.id,
      })
      console.log(quizes, 'quzes')
      return responseMidleWare(res, true, 'quiz created successfully', quizes, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}

export const attemptQuiz = async (req, res) => {
   try {
      const { quizId, questionId, correctAnswer, option } = req.body;
      console.log(quizId, questionId, typeof correctAnswer, option)
      const answers = new Map();
      answers.set(questionId, Number(option));
      const user = req.user;
      const quizes = await AttemptQuiz.find({ quiz: quizId, user: user.id });
      console.log(quizes)
      if (!quizes?.length) {
         const attemptQuiz = new AttemptQuiz({
            quiz: quizId,
            user: user.id,
            score: 0,
            answers: answers
         })
         await attemptQuiz.save();
         console.log(attemptQuiz)
         return responseMidleWare(res, true, 'quiz attempted successfully', attemptQuiz, 201);
      }
      else {
         const attemptedQuiz = await AttemptQuiz.findOne({ quiz: quizId, user: user.id });
         const answersofQuiz = attemptedQuiz.answers;
         answersofQuiz.set(questionId, Number(option));
         const attemptQuiz = await AttemptQuiz.findOneAndUpdate({ quiz: quizId, user: user.id }, {
            $set: {
               answers: answersofQuiz,
               score: 0
            }
         },
            {
               new: true
            })
         console.log(attemptQuiz)
         return responseMidleWare(res, true, 'quiz attempted successfully', attemptQuiz, 201);
      }
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const submitQuiz = async (req, res) => {
   try {
      console.log(req.body, 'submitted quiz')
      const quizId = req.body?.quizId;
      const user = req.user;

      const quizes = await AttemptQuiz.find({ quiz: quizId, user: user.id });
      quizes[0].score=0;
      await quizes[0].answers.forEach(async (value, key) => {
         const question = await Question.findById(key);
         if (value == question.correctAnswer) {
            quizes[0].score++;
         }
      })
      let datya = await quizes[0].save();
      let data=await AttemptQuiz.findOneAndUpdate({ quiz: quizId, user: user.id }, {
         $set: {
            score: datya.score
         }
      },
         {
            new: true
         })
      return responseMidleWare(res, true, 'quiz submitted successfully', data, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const getAttemptedOptions = async (req, res) => {
   try {
      console.log(req.query, 'aa')
      const quizId = req.query.id;
      const user = req.user;
      const quizes = await AttemptQuiz.find({ quiz: quizId, user: user.id });
      return responseMidleWare(res, true, 'quiz submitted successfully', quizes[0].answers, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
export const getattempterQuize = async (req, res) => {
   try {
      const user = req.user;
      const quizes = await AttemptQuiz.find(
         { user: user.id },
         { score: 1, quiz: 1 }
      )
         .populate({
            path: 'quiz',
            select: 'quizName'
         })
         .sort({ updatedAt: -1 });
      return responseMidleWare(res, true, 'quiz submitted successfully', quizes, 201);
   }
   catch (e) {
      return responseMidleWare(res, false, e.message, '', 401);
   }
}
