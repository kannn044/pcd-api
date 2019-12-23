import * as Knex from 'knex';

export class TopicModel {

  async getTopic(db: any, tableName, limit = 100000000000, offset = 0) {
    var col = await db.collection(tableName)
    let rs = await col.find({ 'status': 'public' }).limit(limit).skip(offset).toArray();
    return rs;
  }

  async getMenu(db: any) {
    var col = await db.collection('menu')
    let rs = await col.find().toArray();
    return rs;
  }
  async getSubmenu(db: any,table) {
    var col = await db.collection('topic')
    let rs = await col.find({'topic':table}).toArray();
    return rs;
  }
}