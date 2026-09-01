// import mongo model
import User from '../models/User.js';

// desc - get user
// route - GET /api/v1/users
// access - public

export const getUserAccount = (req, res, next) => {
  res.status(200).json({
    request: 'GET',
    msg: 'Account for user'
  });
};




export const createUserAccount = async (req, res, next) => {

  const newUser = await User.create(req.body);

  res.status(201).json({Success: true, data: newUser });
};

export const deleteAccount = async (req,res,next) => {
  console.log('params:', req.params);
  console.log('userId:', req.params.userId);
  
  const user = await User.findByIdAndDelete(req.params.userId);

  if(!user) {
    return res.status(404).json({success: false, msg: 'User not found.'});
  }

  res.status(200).json({message: 'Account has been deleted.', data: {} });
  console.log(req.params.userId, 'has been deleted.');
};

