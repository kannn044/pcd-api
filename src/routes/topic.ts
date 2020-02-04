import { Router, Request, Response } from 'express';
import { TopicModel } from '../models/topic';
const model = new TopicModel();
import { Jwt } from '../models/jwt';


const router: Router = Router();
const jwt = new Jwt();

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const limit = +req.query.limit;
    const offset = +req.query.offset;
    const query = req.query.query
    const isToken = req.isToken;
    let table: any;
    if (isToken) {
      const decoded = req.decoded;
      table = await model.getTopicPrivate(db, limit, offset, query);
    } else {
      table = await model.getTopicPublic(db, limit, offset, query);
    }
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

// router.get('/detail', async (req: Request, res: Response) => {
//   try {
//     const db = req.db;
//     const topic = req.query.topic;
//     const isToken = req.isToken;
//     const table = await model.getTopicDetail(db, topic);
//     let get = false;
//     if (table[0].status == 'public') {
//       get = true;
//     } else if (table[0].status == 'login') {
//       if (isToken) {
//         get = true;
//       }
//     }

//     if (get) {
//       res.send({ ok: true, rows: table[0] });
//     } else {
//       res.send({ ok: false, error: 'ไม่มีสิทธิ์' });
//     }
//   } catch (error) {
//     res.send({ ok: false, error: error });
//   }
// });

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
    const isToken = req.isToken;


    for (const t of table) {
      const menu = await model.getSubmenu(db, t.code)
      for (let m = 0; m < menu.length; m++) {
        if (menu[m].status != 'public') {
          if (!isToken) {
            menu.splice(m, 1);
          }
        }
      }

      t.menu = menu;
    }
    res.send({ ok: true, rows: table });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});


export default router;