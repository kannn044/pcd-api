import * as Knex from 'knex';

export class ExportModel {

  async getInfo(db: any, tableName, type) {
    return db('view_exports')
      .where('topic', tableName)
      .where('type', type);
  }

}