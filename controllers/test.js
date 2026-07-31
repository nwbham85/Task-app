import Test from '../models/Test.js';

// GET /test
export async function getItems(req, res) {
    try {
        const items = await Test.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// POST /test
export async function postItems(req, res) {
    try {
        const { count, group } = req.body;

        if (!Number.isFinite(count)) {
            return res.status(400).json({
                success: false,
                message: 'count must be a number'
            });
        }

        const item = await Test.create({
            count,
            group
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}