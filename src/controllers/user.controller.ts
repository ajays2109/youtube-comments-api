import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { v4 as uuidv4 } from 'uuid';
/**
 * Controller to handle user-related requests.
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
   try{
    
    const user = {
        userId: uuidv4(), // Generate a unique user ID
        userName: req.body.userName,
        userAvatar: req.body.userAvatar,
    };
    
    const createdUser = await userService.createUser(user);

    // Respond with the created user
    res.status(201).json({
        status: 'success',
        data: createdUser
    });
   }
   catch (error){
    next(error);
   }
};