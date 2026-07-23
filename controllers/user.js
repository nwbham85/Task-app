import User from '../models/User.js';
import bcrypt from 'bcryptjs';


//login process - check for email
export async function loginUser(req,res) {

    const {email, password} = req.body;

    const user = await User.findOne({email});

    console.log(user);

}




//desc get all users
// route - GET /api/v1/user
export const getUser = async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        
    });
}

//desc - create new user
// route - POST /api/v1/user
export const createUser = async (req, res) => {
    try {
        const {
            firstName,
            username,
            email,
            password
        } = req.body;

        if (!username?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            $or: [
                { userName: normalizedUsername },
                { email: normalizedEmail }
            ]
        });

        if (existingUser) {
            const message =
                existingUser.userName === normalizedUsername
                    ? 'That username is already taken'
                    : 'An account with that email already exists';

            return res.status(409).json({
                success: false,
                message
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName: firstName?.trim(),
            userName: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                username: user.userName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Create user error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const validationError = Object.values(error.errors)[0];

            return res.status(400).json({
                success: false,
                message: validationError.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to create account'
        });
    }
};