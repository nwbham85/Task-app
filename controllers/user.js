import User from '../models/User.js';


//desc get all users
// route - GET /api/v1/user
export const getUser = async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        
    });
}

//desc - create new user
// route - POST /api/v1/user
export const createUser = async(req,res) => {
    res.status(201).json({
        message: "User created",
    });
}