import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lets Express read form submissions
app.use(express.urlencoded({ extended: true }));

// Lets Express read JSON too, useful for Postman/fetch later
app.use(express.json());
app.use(express.static(__dirname));



function validateNewPost(req, res, next) {
    const {
        firstName,
        firstLetter,
        email,
        phone,
        driver,
        relationship,
        state
    } = req.body;

    const errors = [];

    if (!firstName) {
        errors.push('First name is required.');
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
        errors.push('First name must contain letters only.');
    } else if (firstName.length > 25) {
        errors.push('First name must be 25 characters or less.');
    }

    if (!firstLetter) {
        errors.push('First letter is required.');
    } else if (!/^[A-Za-z]$/.test(firstLetter)) {
        errors.push('First letter must be one letter only.');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format.');
    }

    if (phone) {
        const digitsOnly = phone.replace(/\D/g, '');

        if (digitsOnly.length !== 10) {
            errors.push('Phone number must be 10 digits.');
        }
    }

    if (driver && !/^\d{4}$/.test(driver)) {
        errors.push("Driver's license must be exactly 4 digits.");
    }

    const validRelationships = ['exWife', 'exGirlFriend', 'other'];

    if (!relationship) {
        errors.push('Relationship is required.');
    } else if (!validRelationships.includes(relationship)) {
        errors.push('Invalid relationship option.');
    }

    if (!state) {
        errors.push('State is required.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
}

app.post('/api/newpost', validateNewPost, (req, res) => {
    const newPost = {
        firstName: req.body.firstName.trim(),
        firstLetter: req.body.firstLetter.trim().toUpperCase(),
        email: req.body.email?.trim() || null,
        phone: req.body.phone?.trim() || null,
        driver: req.body.driver?.trim() || null,
        relationship: req.body.relationship,
        state: req.body.state || 'alabama',
        createdAt: new Date()
    };

    console.log('New post received:', newPost);

    res.status(201).json({
        success: true,
        message: 'New post created successfully.',
        post: newPost
    });
});




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});