import * as Knex from 'knex';

export class ServiceModel {

  async getTable(db: any, tableName, limit = 100000000000, offset = 0) {
    var col = await db.collection(tableName)
    let rs = await col.find().limit(limit).skip(offset).toArray();
    return rs;
  }

  async getCount(db: any, tableName) {
    var col = await db.collection(tableName)
    let rs = await col.count();
    return rs;
  }
  async getTopicInfo(db: any, collection) {
    var col = await db.collection('topic')
    let rs = await col.find({ 'collection': collection }).toArray();
    return rs;
  }
}