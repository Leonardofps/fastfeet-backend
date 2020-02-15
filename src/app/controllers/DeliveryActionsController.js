import { getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryboy from '../models/Deliveryboy';

class DeliveryActionsController {
  async update(req, res) {
    const { deliveryId, deliveryboyId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    const deliveryboy = await Deliveryboy.findByPk(deliveryboyId);

    if (!delivery || !deliveryboy) {
      return res.status(400).json({ error: 'Delivery can not be a started' });
    }

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (!deliveryboy) {
      return res.status(400).json({ error: 'Deliveryboy not found' });
    }

    const date = new Date();
    const hour = getHours(date);

    if (hour < 8 || hour > 23) {
      return res.status(400).json({
        error: 'You can only start a delivery beetwen 08:00 and 18:00',
      });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryboy_id: deliveryboyId,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (deliveries.length > 5) {
      return res
        .status(400)
        .json({ error: 'You can only make 5 deliveries per day' });
    }

    const started = await delivery.update({ start_date: date });

    return res.json(started);
  }
}

export default new DeliveryActionsController();
