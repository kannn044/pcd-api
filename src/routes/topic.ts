import { Router, Request, Response } from 'express';
import { TopicModel } from '../models/topic';
const model = new TopicModel();


const router: Router = Router();


router.get('/', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const limit = +req.query.limit;
    const offset = +req.query.offset;
    const query = req.query.query
    const table = await model.getTopic(db, 'topic', limit, offset,query);
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/total', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const table = await model.getTotalTopic(db, 'topic');
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/menu', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const table = await model.getMenu(db);
    for (const t of table) {
      const menu = await model.getSubmenu(db, t.code)
      t.menu = menu;
    }
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});


export default router;