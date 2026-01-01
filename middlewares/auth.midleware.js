import jwt from 'jsonwebtoken';

export const verifyToken=async (req,res,next)=>{
    try{
        const authHeaders=req.headers['authorization'];
        const accessToken=authHeaders && authHeaders.split(' ')[1];
        console.log(accessToken)
        if(!accessToken){
            res.sendStatus(401);
        }
        console.log(process.env.ACCESS_TOKEN_SECRET)
        const user=await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        console.log(user);
        if(!user)
            res.sendStatus(403);
        req.user=user;
        next();
    }
    catch(err){
       if(err.name==='TokenExpiredError'){
        res.sendStatus(401);
       }
        res.sendStatus(403);
    }
}

export const isAdmin=(req,res,next)=>{
    const user=req.user;
    if(user?.role!=='Admin')
        return res.sendStatus(403);
    next();
}