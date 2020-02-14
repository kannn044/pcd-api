/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { Login } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new Login();
const jwt = new Jwt();

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  let username: string = req.body.username;
  let password: string = req.body.password;
  let db = req.dbMysql;

  try {
    if(username && password){
      let encPassword = crypto.createHash('md5').update(password).digest('hex');
      let rs: any = await loginModel.login(db, username, encPassword);
  
      if (rs.length) {
  
        let payload = {
          fullname: `${rs[0].first_name} ${rs[0].last_name}`,
          username:rs[0].username,
          id: rs[0].user_id,
          isManage: rs[0].is_manage,
          departmentId: rs[0].department_id
        }
  
        let token = jwt.sign(payload);
        res.send({ ok: true, token: token, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
      }
    } else {
      res.send({ ok: false, error: 'กรุณากรอก username, password' });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});

export default router;