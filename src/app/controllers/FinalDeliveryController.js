import * as Yup from 'yup';
import File from '../models/File';
import Delivery from '../models/Delivery';
import Deliveryboy from '../models/Deliveryboy';

class FinalDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** End of Validations from Yup */

    const { signature_id } = req.body;
    const { deliveryId, deliveryboyId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    const deliveryboy = await Deliveryboy.findByPk(deliveryboyId);

    const file = await File.findByPk(signature_id);

    if (!delivery || !deliveryboy) {
      return res.status(400).json({ error: 'Delivery can not be a started' });
    }

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (!deliveryboy) {
      return res.status(400).json({ error: 'Deliveryboy not found' });
    }

    if (!file) {
      return res.status(400).json({ error: 'Signature not found' });
    }

    const date = new Date();

    const ended = await delivery.update({
      end_date: date,
      signature_id,
    });

    return res.json(ended);
  }
}

export default new FinalDeliveryController();
