import User from '../models/User.js';

export async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }

    return res.status(200).json({
        message: 'User found'
    });
}