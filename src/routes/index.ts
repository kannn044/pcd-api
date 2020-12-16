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
    const pm25Value = rs[0].LastUpdate.PM25.value;
    if (pm25Value <= 25) {
      rs[0].LastUpdate.PM25.color = '#b6dde8';
      rs[0].LastUpdate.PM25.level = 'ดีมาก';
      rs[0].LastUpdate.PM25.volume = '(0 - 25 ไมโครกรัม/ลูกบาศก์เมตร)';
      rs[0].LastUpdate.PM25.normalPeople = ['ทํากิจกรรมได้ตามปกติ'];
      rs[0].LastUpdate.PM25.sensitivePeople = ['ทํากิจกรรมได้ตามปกติ'];
    } else if (pm25Value <= 50) {
      rs[0].LastUpdate.PM25.color = '#92d150';
      rs[0].LastUpdate.PM25.level = 'ดี';
      rs[0].LastUpdate.PM25.volume = '(26 - 37 ไมโครกรัม/ลูกบาศก์เมตร)';
      rs[0].LastUpdate.PM25.normalPeople = ['ทํากิจกรรมได้ตามปกติ'];
      rs[0].LastUpdate.PM25.sensitivePeople = ['1.เลี่ยงการทํากิจกรรมหรือออกกําลังกายกลางแจ้ง', '2.เฝ้าระวังอาการ หากมีอาการผิดปกติให้รีบพบแพทย์ทันที'];
    } else if (pm25Value <= 100) {
      rs[0].LastUpdate.PM25.color = '#ffff02';
      rs[0].LastUpdate.PM25.level = 'ปานกลาง';
      rs[0].LastUpdate.PM25.volume = '(38 - 50 ไมโครกรัม/ลูกบาศก์เมตร)';
      rs[0].LastUpdate.PM25.normalPeople = ['1.เลี่ยงการทํากิจกรรมหรือออกกําลังกายกลางแจ้ง', '2.เฝ้าระวังอาการ หากมีอาการผิดปกติให้รีบพบแพทย์ทันที'];
      rs[0].LastUpdate.PM25.sensitivePeople = ['1.ลดการทํากิจกรรมหรือออกกําลังกายกลางแจ้ง', '2.หากต้องออกนอกอาคาร สวมหน้ากากอนามัยหรือ N95', '3.เฝ้าระวังอาการ หากมีอาการผิดปกติให้รีบพบแพทย์ทันที'];
    } else if (pm25Value <= 200) {
      rs[0].LastUpdate.PM25.color = '#ffc001';
      rs[0].LastUpdate.PM25.level = 'เริ่มมีผลกระทบต่อสุขภาพ';
      rs[0].LastUpdate.PM25.volume = '( 51 - 90 ไมโครกรัม/ลูกบาศก์เมตร)';
      rs[0].LastUpdate.PM25.normalPeople = ['1.ลดการทํากิจกรรมหรือออกกําลังกายกลางแจ้ง', '2.หากต้องออกนอกอาคาร สวมหน้ากากอนามัยหรือ N95', '3.เฝ้าระวังอาการ หากมีอาการผิดปกติให้รีบพบแพทย์ทันที'];;
      rs[0].LastUpdate.PM25.sensitivePeople = ['1.งดทํากิจกรรมหรือออกกําลังกายกลางแจ้ง', '2.สวมหน้ากากป้องกันฝุ่น และไม่อยู่นอกอาคารเป็นเวลานาน', '3.ผู้มีโรคประจําตัว เตรียมยาประจําตัวให้พร้อม'];
    } else if (pm25Value >= 201) {
      rs[0].LastUpdate.PM25.color = '#ff0000';
      rs[0].LastUpdate.PM25.level = 'มีผลกระทบต่อสุขภาพ';
      rs[0].LastUpdate.PM25.volume = '(91 ไมโครกรมั/ลูกบาศก์เมตร ขึ้นไป)';
      rs[0].LastUpdate.PM25.normalPeople = ['1.งดทํากิจกรรมหรือออกกําลังกายกลางแจ้ง', '2.หากต้องออกนอกอาคาร สวมหน้ากากอนามัยหรือ N95', '3.ลดกิจกรรมทที่ทำให้เกิดฝุ่นในบ้าน เช่น กวาดบ้าน จุดธูป'];
      rs[0].LastUpdate.PM25.sensitivePeople = ['1.งดออกนอกอาคาร ควรอยู่ในอาคารโดยเฉพาะห้องสะอาด', '2.หากต้องออกนอกอาคาร สวมหน้ากากอนามัยหรือ N95 ทกุครั้ง', '3.ผู้มีโรคประจําตัว เตรียมยาประจําตัวให้พร้อม'];
    }
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

export default router;
