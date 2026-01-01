
import { chapter,topic,quiz,Question } from "../models/chaptre.model.js"

export const createQuizes =async ({data},user)=>{
    const {chapterName,topicName,quizName}=data
    console.log('ffff',data,user);
    const chapters=await chapter.create({
        chapterName:chapterName,
        createdBy:user.id,
    })
    const topics=await topic.create({
        topicName,
        createdBy:user.id,
        chapter:chapters._id,
    })
    const quizes=await quiz.create({
        quizName,
        topicName:topics._id,
        createdBy:user.id,

    })
    console.log(quizes)
    return quizes;
}
export const createQuestions=async ({data})=>{
    const {question,options,correctAnswer,quizId}=data;
    console.log(question,options,correctAnswer,quizId);
    const questions=await Question.create({
       question,
       quiz:quizId,
       options,
       correctAnswer
    })
    console.log(questions)
    return questions;
}
export const getDashBoardData=async(req,res)=>{
    let data=await chapter.aggregate([
        {
           $lookup:{
            from:'topics',
            localField:'_id',
            foreignField:'chapter',
            as:'topics'
           }
        },
        {
            $lookup:{
                from:'quizzes',
                localField:'topics._id',
                foreignField:'topicName',
                as:'allQuizzes'
            }
        },
        {
    $addFields: {
      topics: {
        $map: {
          input: "$topics",
          as: "topic",
          in: {
            $mergeObjects: [
              "$$topic",
              {
                quizes: {
                  $filter: {
                    input: "$allQuizzes",
                    as: "quiz",
                    cond: {
                      $eq: ["$$quiz.topicName", "$$topic._id"]
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  },

  // 4️⃣ Remove temporary array
  {
    $project: {
      allQuizzes: 0
    }
  }
    ])
    console.log(data);
    return data;
}