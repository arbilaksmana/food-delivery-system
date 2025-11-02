const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

const ok = (data) => ({ status: 'success', data });
const fail = (message) => ({ status: 'error', message });

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: List restaurants
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /restaurants
 * List semua restoran
 */
router.get('/', async (_req, res) => {
  try {
    const data = await Restaurant.find().lean();
    res.json(ok(data));
  } catch (e) {
    res.status(500).json(fail(e.message));
  }
});

/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Restaurant not found
 */
/**
 * GET /restaurants/:id
 * Detail restoran (termasuk menu[])
 */
router.get('/:id', async (req, res) => {
  try {
    const data = await Restaurant.findById(req.params.id).lean();
    if (!data) return res.status(404).json(fail('Restaurant not found'));
    res.json(ok(data));
  } catch (e) {
    res.status(500).json(fail(e.message));
  }
});

/**
 * @openapi
 * /restaurants:
 *   post:
 *     summary: Create restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * POST /restaurants
 * Tambah restoran (opsional: admin/seed)
 */
router.post('/', async (req, res) => {
  try {
    const doc = await Restaurant.create(req.body);
    res.status(201).json(ok(doc));
  } catch (e) {
    res.status(400).json(fail(e.message));
  }
});

/**
 * @openapi
 * /restaurants/{id}/menu:
 *   post:
 *     summary: Add menu item to restaurant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 *       404:
 *         description: Restaurant not found
 */
/**
 * POST /restaurants/:id/menu
 * Tambah item menu (opsional: admin/seed)
 */
router.post('/:id/menu', async (req, res) => {
  try {
    const { name, description, price, isAvailable } = req.body;
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).json(fail('Restaurant not found'));

    r.menu.push({ name, description, price, isAvailable });
    await r.save();

    res.status(201).json(ok(r));
  } catch (e) {
    res.status(400).json(fail(e.message));
  }
});

module.exports = router;
