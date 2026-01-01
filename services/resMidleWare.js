export const responseMidleWare=(res,success,message,data,code)=>{
   return res.send({
        success:success,
        data:data,
        message:message,
        code:code
   })
}