import userModel from "../models/user.model.js";
import { generateAccessToken,generateRefreshToken } from "../utils/token.js";
export const rigister= async(
{email,password,role}
)=>{
    const User=new userModel({email,password,role});
    await User.save();
}
export const loginUser=async(
    {email,password}
)=>{
            const user=await userModel.findOne({email});
            if(!user)
            {
               throw new Error('Invalid credintials');
            }
            const validPassword=await user.comparePassword(password);
            if(!validPassword)
                throw new Error('Invalid credintials');
            const accessToken=await generateAccessToken(user);
            const refreshToken=await generateRefreshToken(user);
            return {
                accessToken:accessToken,
                refreshToken:refreshToken,
                user:user
            }
}
export const setRefreshToken=async({})=>{

}