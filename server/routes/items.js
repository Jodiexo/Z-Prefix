const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const auth = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
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

router.get('/', authMiddleware, async (req, res) => {
    try {
       const items = await db('items')
      .select('id', 'name', 'description', 'quantity', 'user_id')
      .modify(function(queryBuilder) {
        queryBuilder.select(db.raw('CASE WHEN LENGTH(description) > 100 THEN CONCAT(LEFT(description, 100), \'...\') ELSE description END as description'));
         });
          res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
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

router.put('/:id', authMiddleware, async (req, res) => {
    const { name, description, quantity } = req.body;
    try {
        const [updatedItem] = await db('items')
            .where({ id: req.paarams.id, user_id: req.user.id })
            .update({ name, descreiption, quantity })
            .returning('*');
    if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(updatedItem);
 }  catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
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
        res.status(500).json({ error: 'Server error' })
    }
});

//public routes
router.get('/public', async (req, res) => {
    try {
        const items = await db('items')
            .select('id', 'name', 'description', 'quantity', 'user_id')
            .modify(function (queryBuilder) {
                queryBuilder.select(db.raw('CASE WHEN LENGTH(description) > 100 THEN CONCAT(LEFT(description, 100), \'...\') ELSE description END as description'));
            });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' })
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
        res.status(500).json({ error: 'Server error' })
    }
});

module.exports = router;