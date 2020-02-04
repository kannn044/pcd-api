import * as jwt from 'jsonwebtoken';

export class Jwt {
  private secretKey = process.env.SECRET_KEY;

  sign(playload: any) {
    let token = jwt.sign(playload, this.secretKey, {
      expiresIn: '1d'
    });
    return token;
  }

  signApiKey(playload: any) {
    let token = jwt.sign(playload, this.secretKey, {
      expiresIn: '1y'
    });
    return token;
  }

  async verify(token: string) {
    try {

      const decoded = await jwt.verify(token, this.secretKey);
      if (decoded) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  decoded(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      });
    });
  }

}