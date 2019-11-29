import * as Knex from 'knex';

export class ServiceModel {

  async getTable(db: any, tableName, limit = 100000000000, offset = 0) {
    console.log(limit);

    var col = await db.collection(tableName)
    let rs = await col.find().limit(limit).skip(offset).toArray();
    return rs;
  }

  async getCount(db: any, tableName) {
    var col = await db.collection(tableName)
    let rs = await col.count();
    return rs;
  }

}