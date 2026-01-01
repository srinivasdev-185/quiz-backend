import strict from "assert/strict";
import userModel from "../models/user.model.js";
import { generateAccessToken,generateRefreshToken } from "../utils/token.js";
import { loginUser } from "../services/auth.service.js";
import {responseMidleWare} from "../services/resMidleWare.js";
import jwt from 'jsonwebtoken';

export const register=async (req,res)=>{
    try{
    const {firstName,lastName,email,password,role}=req.body;
    const user=new userModel({firstName,lastName,email,password,role});
    user.save();
    res.status(201).json({message:'user register successfully'});
    }
    catch(err){
    res.status(400).json({message:err.message});        
    }
};

export const login=async(req,res)=>{
   try{
    let data=await loginUser(req.body);
    res.cookie('refresh_token',data.refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        path:'/'
    })
    return responseMidleWare(res,true,'User login Succsessfully',data,201);
   }
   catch(e){
    return responseMidleWare(res,false,e.message,'',400);
   }
}

export const refresh=async (req,res)=>{
    const refreshToken=req.cookies.refresh_token;
    console.log(refreshToken)
    if(!refreshToken)
        res.sendStatus(403);
    try{
        const payLoad=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const accessToken=generateAccessToken({_id:payLoad.id,role:payLoad.role || 'User'});
        res.status(201).json({accessToken})
    }
    catch(err){
        res.sendStatus(403);
    }

}

export const logOut=(req,res)=>{
    console.log('log out')
    res.clearCookie('refreshToken',{ 
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
    });
    res.json({message:'log out successfully'});
}
export const getAdminRequists=async(req,res)=>{
    try{
        const users=await userModel.find({role:'AdminRequest'}).select('firstName lastName email _id');
        return responseMidleWare(res,true,'Admin Requists Fetch Successfully',users,201);
    }
    catch(e){
        return responseMidleWare(res,false,e.message,'',400);
    }
}
export const approveAdmin=async(req,res)=>{
   try{
      const {id}=req.params;
      const user=await userModel.findByIdAndUpdate(id,{role:'Admin'});
      return responseMidleWare(res,true,'Admin Approved Successfully',user,201);
   }
   catch(e){
      return responseMidleWare(res,false,e.message,'',401);
   }
}
export const rejectAdmin=async(req,res)=>{
   try{
      const {id}=req.params;
      const user=await userModel.findByIdAndUpdate(id,{role:'User'});
      return responseMidleWare(res,true,'Admin Rejected Successfully',user,201);
   }
   catch(e){
      return responseMidleWare(res,false,e.message,'',401);
   }
}