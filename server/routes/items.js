const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/public', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const items = await db('items')
            .select('id', 'name', 'description', 'quantity', 'user_id')
            .select(db.raw('CASE WHEN LENGTH(description) > 100 THEN CONCAT(LEFT(description, 100), \'...\') ELSE description END as description'))
            .limit(limit)
            .offset(startIndex);
        
        const totalItems = await db('items').count('id as count').first();
        
        res.json({
            items,
            currentPage: page,
            totalPages: Math.ceil(totalItems.count / limit),
            totalItems: parseInt(totalItems.count)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/public/:id', async (req, res) => {
    try {
        const item = await db('items')
            .where({ id: req.params.id })
            .first();
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Protected routes (authentication required)
router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { name, description, quantity } = req.body;
    try {
        const [item] = await db('items').insert({
            name,
            description,
            quantity,
            user_id: req.user.id
        }).returning('*');
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
       
        const items = await db('items')
            .where({ user_id: req.user.id })
            .select('id', 'name', 'description', 'quantity', 'user_id')
            .select(db.raw('CASE WHEN LENGTH(description) > 100 THEN CONCAT(LEFT(description, 100), \'...\') ELSE description END as description'))
            .limit(limit)
            .offset(startIndex);
        
        const totalItems = await db('items').where({ user_id: req.user.id }).count('id as count').first();
          
        res.json({
            items,
            currentPage: page,
            totalPages: Math.ceil(totalItems.count / limit),
            totalItems: parseInt(totalItems.count)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await db('items').where({ id: req.params.id, user_id: req.user.id }).first();
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { name, description, quantity } = req.body;
    try {
        const [updatedItem] = await db('items')
            .where({ id: req.params.id, user_id: req.user.id })
            .update({ name, description, quantity })
            .returning('*');
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCount = await db('items')
            .where({ id: req.params.id, user_id: req.user.id })
            .del();
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;