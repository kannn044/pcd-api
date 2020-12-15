const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`;

export class ServiceModel {

  async insert(db: any, data) {
    let rs = await db.collection('pcd').insertMany(data);
    return rs;
  }

  async remove(db: any) {
    let rs = await db.collection('pcd').remove();
    return rs;
  }

  async insertHistory(db: any, data) {
    let rs = await db.collection('pcd_history').insertMany(data);
    return rs;
  }

  getStation() {
    return new Promise((resolve: any, reject: any) => {
      const options = {
        method: 'GET',
        url: 'http://air4thai.pcd.go.th/services/getNewAQI_JSON.php',
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }

  async getClosetStation(lng, lat) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url).then((db) => {
        db.db('catalogue').collection('pcd')
          .aggregate([
            {
              $geoNear: {
                near: { type: "Point", coordinates: [+lng, +lat] },
                key: "locations",
                distanceField: "dist.calculated"
              }
            },
            { $limit: 1 }
            
          ]).toArray()
          .then((result) => { resolve(result); })
          .catch((err) => { reject(err.message); })
          .finally(() => { db.close(); });
      }).catch((err) => { reject(err.message); });
    });
  }
}