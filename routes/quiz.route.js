import express from 'express';
import { createQuiz } from '../controllers/quiz.controller.js';
import { createQuestion } from '../controllers/quiz.controller.js';
import { getQuestionsOfQuiz, updateQuestion, getDashboardData } from '../controllers/quiz.controller.js';
import { addChpater, addTopic, addQuiz } from '../controllers/quiz.controller.js';
import { attemptQuiz } from '../controllers/quiz.controller.js';
import { submitQuiz } from '../controllers/quiz.controller.js';
import { getAttemptedOptions,getattempterQuize } from '../controllers/quiz.controller.js';
const router = express.Router();


router.post('/createQuestion', createQuestion);
router.post('/createChapter', createQuiz);
router.get('/getQuestionOfQuiz', getQuestionsOfQuiz);
router.post('/updateQuestion', updateQuestion);
router.get('/getDashboardData', getDashboardData)
router.post('/addChapter', addChpater);
router.post('/addTopic', addTopic);
router.post('/addQuiz', addQuiz);
router.post('/attemptQuiz',attemptQuiz)
router.post('/submitQuiz',submitQuiz)
router.get('/getAttemptedAnswers',getAttemptedOptions);
router.get('/getattempterQuize',getattempterQuize);
export default router