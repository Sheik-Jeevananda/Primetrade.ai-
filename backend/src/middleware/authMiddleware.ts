import { type Request , type Response , type NextFunction} from "express";

import jwt from "jsonwebtoken";

import user from "../models/user.js";


interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: any;
}


export const protect = async (
  req : AuthRequest,
  res : Response,
  next : NextFunction
) : Promise<void>=>{


  try{
    let token;

    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer") )
      {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token!,
        process.env.JWT_SECRET as string) as unknown as JwtPayload;
    
      const foundUser = await user.findById(decoded.id).select("-password");
      if(!foundUser){
        res.status(401).json({
          message : "Unauthorized"
        });
      }
      req.user = foundUser;
      next();
    
    }

  }catch(err){
    res.status(401).json({
      message : "Unauthorized"
    });
  }
};
