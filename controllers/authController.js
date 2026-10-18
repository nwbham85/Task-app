import bcrypt from 'bcryptjs';
import User from '../models/RegisterUser.js';

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required.'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: 'That username or password is not valid.'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'That username or password is not valid.'
      });
    }

    return res.status(200).json({
      message: 'Login successful.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to log in.'
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required.'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'That username or email is already registered.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: passwordHash
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        message: 'That username or email is already registered.'
      });
    }

    return res.status(500).json({
      message: 'Unable to register.'
    });
  }
};
