import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Read Authorization header
//         ↓
// Extract token
//         ↓
// Verify signature and expiration
//         ↓
// Load user and place it on req.user

export async function protect(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader ||
                !authorizationHeader.startsWith('Bearer')
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Authentication token required.'
                });
            }

            const token = authorizationHeader.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success:false,
                    message: 'Auth token is required.'
                });
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.userId).select(
            '-password'
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'The user for this token no longer exists'
            });
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'This account has been suspended'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Your session has expired'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token'
            });
        }

        console.error('Authentication middleware error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to authenticate request'
        });
    }
    }
