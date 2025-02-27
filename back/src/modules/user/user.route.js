import { Router } from 'express';
import { getAll, get, save, remove } from './index.js';
import { authMiddleware} from '../../middleware/authMiddleware.js'

const router = Router();

router.get('/', async (_, res) => {
    const data = await getAll();
    res.status(200).json({ data });
});

router.get('/me', authMiddleware, async (req, res) => {
    return res.status(200).json({ data: req.user });
});

router.get('/:id', async (req, res) => {
    const data = await get(req.params.id);
    res.status(200).json({ data });
});

router.post('/', async (req, res) => {
    const data = await save(req.body);
    res.status(200).json({ data });
});

router.put('/:id', async (req, res) => {
    const data = await update(req.params.id, req.body);
    res.status(200).json({ data });
});

router.delete('/:id', async (req, res) => {
    const data = await remove(req.params.id);
    res.status(200).send({data});
});

export default router;