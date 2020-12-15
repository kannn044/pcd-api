import { Router, Request, Response } from 'express';
import { ServiceModel } from '../models/service';

const model = new ServiceModel;
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.send({ ok: true, message: 'Welcome to PCD Api' });
});

router.get('/closet-station', async (req: Request, res: Response) => {
  const lng = req.query.lng;
  const lat = req.query.lat;
  try {
    const rs = await model.getClosetStation(lng, lat);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

export default router;
