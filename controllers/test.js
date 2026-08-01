import Test from '../models/Test.js';

// GET /test
export async function getItems(req, res) {
    try {
        const items = await Test.find().sort({
            createdAt: 1
        });

        return res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// POST /test
export async function postItems(req, res) {
    try {
        console.log('POST /test request body:', req.body);

        const { count, group } = req.body ?? {};
        const numericCount = Number(count);

        if (!Number.isFinite(numericCount)) {
            return res.status(400).json({
                success: false,
                message: 'count must be a valid number'
            });
        }

        if (!group || typeof group !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'group is required'
            });
        }

        const item = await Test.create({
            count: numericCount,
            group: group.trim()
        });

        return res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('POST /test controller error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}