import { Router, Request, Response } from 'express';
import { ServiceModel } from '../models/service';
const serviceModel = new ServiceModel();
import * as _ from 'lodash';

const router: Router = Router();


router.get('/:tableName', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const limit = +req.query.limit;
    const offset = +req.query.offset;
    const tableName = req.params.tableName;
    const tableSchemaName = `${tableName}_schema`;
    const table = await serviceModel.getTable(db, tableName, limit, offset);
    const schema = await serviceModel.getTable(db, tableSchemaName);
    const fil =_.filter(schema, function(o) { return o.status != 'public'; });
    
    for (const t of table) {
      for (const f of fil) {
        t[f.column]='##PRIVATE##'; 
      }
    }

    res.send({ ok: true, schema: schema, rows: table });

  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/:tableName/schema', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const tableName = req.params.tableName;
    const tableSchemaName = `${tableName}_schema`;
    const schema = await serviceModel.getTable(db, tableSchemaName);
    const count = await serviceModel.getCount(db, tableName);
    res.send({ ok: true, rows: schema, total: count });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});
export default router;