/// <reference path="../typings.d.ts" />

require('dotenv').config();

import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as HttpStatus from 'http-status-codes';
import * as express from 'express';
import * as cors from 'cors';

import Knex = require('knex');
import { Router, Request, Response, NextFunction } from 'express';
import { ServiceModel } from './models/service';
import indexRoute from './routes/index';
import moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
var cron = require('node-cron');
const router: Router = Router();

const serviceModel = new ServiceModel;
// Assign router to the express.Router() instance
const app: express.Application = express();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('.ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());

// Mongodb middleware connection
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`;

app.use('/', indexRoute);

cron.schedule('*/15 * * * *', async () => {
  const rs: any = await serviceModel.getStation();
  let data: any = [];
  for (const v of rs.stations) {
    const obj: any = {};
    obj.stationID = v.stationID;
    obj.nameTH = v.nameTH;
    obj.nameEN = v.nameEN;
    obj.areaTH = v.areaTH;
    obj.areaEN = v.areaEN;
    obj.stationType = v.stationType;
    obj.locations = {
      "type": "Point",
      "coordinates": [+v.long, +v.lat]
    }
    obj.lastUpdate = v.lastUpdate
    obj.d_update = moment().format('YYYY-MM-DD HH:mm:ss');
    data.push(obj);
  }

  MongoClient.connect(url).then(async (db) => {
    if (rs.stations.length > 0) {
      await serviceModel.remove(db);
    }
    await serviceModel.insert(db, data);
    await serviceModel.insertHistory(db, data);
    db.close()
  });
});
//error handlers

if (process.env.NODE_ENV === 'development') {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        ok: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      }
    });
  });
}

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      ok: false,
      code: HttpStatus.NOT_FOUND,
      error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  });
});

export default app;
