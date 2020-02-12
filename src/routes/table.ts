import { TopicModel } from './../models/topic';
import { Router, Request, Response } from 'express';
import { ServiceModel } from '../models/service';
import { ExportModel } from '../models/export';
const serviceModel = new ServiceModel();
import * as _ from 'lodash';
const xl = require('excel4node');
const router: Router = Router();
const topicModel = new TopicModel();
const exportModel = new ExportModel();
import * as moment from 'moment';

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


router.get('/:tableName/excel', async (req: Request, res: Response) => {
  try {
    const dbMysql = req.dbMysql;
    const tableName = req.params.tableName;
    try {
      const rs: any = await exportModel.getInfo(dbMysql, tableName, 'EXCEL');
      if(rs.length){
        const date = moment(rs[0].create_datetime).format('YY:MM:DD');
       const filename = `${rs[0].topic}`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=456" + filename);
        res.sendfile(`exports/${rs[0].filename}`);
      } else {

      }
    } catch (error) {

    }
    // const limit = +req.query.limit;
    // const offset = +req.query.offset;
    // const tableName = req.params.tableName;
    // const isToken = req.isToken;
    // const topic = await serviceModel.getTopicInfo(db, tableName);
    // let statusUser: any;

    // if (isToken) {
    //   const idxUser = topic.private_users.indexOf(req.decoded.username);
    //   if (idxUser > -1) {
    //     statusUser = 'private';
    //   } else {
    //     statusUser = 'login';
    //   }
    // } else {
    //   statusUser = 'public';
    // }

    // const schemaAll = await serviceModel.getTable(db, topic[0].schema);
    // let schema;
    // if (statusUser == 'public') {
    //   schema = _.filter(schemaAll, function (o) { return o.export.public.indexOf('excel') > -1 });
    // } else if (statusUser == 'login') {
    //   schema = _.filter(schemaAll, function (o) { return o.export.login.indexOf('excel') > -1 });
    // } else if (statusUser == 'private') {
    //   schema = _.filter(schemaAll, function (o) { return o.export.private.indexOf('excel') > -1 });
    // }

    // const table = await serviceModel.getTable(db, tableName, limit, offset);
    // for (const t of table) {
    //   for (const f of schema) {
    //     delete t[f.column];
    //   }
    // }

    // if (get) {
    //   if (!isToken) {
    //   }
    //   const statusTable = topic[0].status;
    //   console.log(statusTable);

    //   // console.log(topic[0].export);
    //   let exports = [];
    //   if (statusTable == 'login' && isToken) {
    //     exports = topic[0].export.login;
    //   } else if (statusTable == 'private' && isToken) {
    //     exports = topic[0].export.private;
    //   } else {
    //     exports = topic[0].export.public;
    //   }
    //   const idx = exports.indexOf('excel');
    //   if (idx > -1) {
    //     const column = schema.length;
    //     const wb = new xl.Workbook();
    //     const ws = wb.addWorksheet('Sheet 1');
    //     ws.cell(1, 1, 1, column, true).string(topic[0].collection_th);
    //     let c = 1;
    //     for (const s of schema) {
    //       ws.cell(2, c).string(s.column);
    //       c++;
    //     }
    //     let row = 3;
    //     for (const t of table) {
    //       c = 1;
    //       for (const s of schema) {
    //         ws.cell(row, c).string(t[s.column]);
    //         c++;
    //       }
    //       row++;
    //     }
    //     wb.write('Excel.xlsx');
    //   }




    // res.send({ ok: true });
    // } else {
    //   res.send({ ok: false, error: 'ไม่มีสิทธิ์' });
    // }
  } catch (error) {
    console.log(error);

    res.send({ ok: false, error: error });
  }
});
export default router;