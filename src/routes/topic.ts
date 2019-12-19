import { Router, Request, Response } from 'express';
import { TopicModel } from '../models/topic';
const model = new TopicModel();


const router: Router = Router();


router.get('/', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const limit = +req.query.limit;
    const offset = +req.query.offset;
    const table = await model.getTopic(db, 'topic', limit, offset);
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/menu', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const table = await model.getMenu(db);
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});


export default router;