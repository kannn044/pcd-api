import { Router, Request, Response } from 'express';
import { ServiceModel } from '../models/service';
const serviceModel = new ServiceModel();


const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {

    res.send({ ok: true, rows: 'API this Work' });

  } catch (error) {
    res.send({ ok: false, error: error });
  }

});

export default router;
