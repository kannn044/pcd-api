import { TopicModel } from './../models/topic';
import { Router, Request, Response } from 'express';
import { ServiceModel } from '../models/service';
const serviceModel = new ServiceModel();
import * as _ from 'lodash';

const router: Router = Router();
const topicModel = new TopicModel();


router.get('/:tableName', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const limit = +req.query.limit;
    const offset = +req.query.offset;
    const tableName = req.params.tableName;
    const isToken = req.isToken;
    const topic = await serviceModel.getTopicInfo(db, tableName);
    let get = false;
    if (topic[0].status == 'public') {
      get = true;
    } else if (topic[0].status == 'login') {
      if (isToken) {
        get = true;
      }
    }

    if (get) {
      const table = await serviceModel.getTable(db, tableName, limit, offset);
      const schema = await serviceModel.getTable(db, topic[0].schema);
      if (!isToken) {
        const fil = _.filter(schema, function (o) { return o.status != 'public'; });
        for (const t of table) {
          for (const f of fil) {
            console.log(f.column);

            delete t[f.column];
            // t[f.column] = '##PRIVATE##';
          }
        }
      }
      res.send({ ok: true, schema: schema, rows: table });
    } else {
      res.send({ ok: false, error: 'ไม่มีสิทธิ์' });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/:tableName/detail', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const tableName = req.params.tableName;
    const isToken = req.isToken;
    const table = await serviceModel.getTopicInfo(db, tableName);
    let get = false;
    if (table[0].status == 'public') {
      get = true;
    } else if (table[0].status == 'login') {
      if (isToken) {
        get = true;
      }
    }

    if (get) {
      res.send({ ok: true, rows: table[0] });
    } else {
      res.send({ ok: false, error: 'ไม่มีสิทธิ์' });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/:tableName/schema', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const tableName = req.params.tableName;
    const isToken = req.isToken;
    const topic = await serviceModel.getTopicInfo(db, tableName);
    let get = false;
    if (topic[0].status == 'public') {
      get = true;
    } else if (topic[0].status == 'login') {
      if (isToken) {
        get = true;
      }
    }
    if (get) {
      const schema = await serviceModel.getTable(db, topic[0].schema);
      const count = await serviceModel.getCount(db, tableName);
      if (!isToken) {
        for (let i = 0; i < schema.length; i++) {
          if (schema[i].status != 'public') {
            schema.splice(i, 1);
          }
        }
      }
      res.send({ ok: true, rows: schema, total: count });
    } else {
      res.send({ ok: false, error: 'ไม่มีสิทธิ์' });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});
export default router;