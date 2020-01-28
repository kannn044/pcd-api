import * as Knex from 'knex';

declare module 'express' {
  interface Request {
    db: any, // Actually should be something like `multer.Body`
    dbMysql: any,
    knex: Knex,
    decoded: any, // Actually should be something like `multer.Files`
    token: any
  }
}