import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryboy from '../models/Deliveryboy';
import File from '../models/File';

import NotificationMail from '../jobs/NotificationMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { page } = req.query;
    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
        'recipient_id',
        'deliveryboy_id',
        'signature_id',
      ],
      include: [
        {
          model: Deliveryboy,
          as: 'deliveryboy',
          attributes: ['id', 'name'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'cep'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryboy_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** End of Validations from Yup */

    const { recipient_id, deliveryboy_id, product } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    const deliveryboy = await Deliveryboy.findByPk(deliveryboy_id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!recipient || !deliveryboy) {
      return res.status(400).json({ error: 'Delivery already exists' });
    }

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (!deliveryboy) {
      return res.status(400).json({ error: 'Deliveryboy not found' });
    }

    const delivery = await Delivery.create({
      recipient_id,
      deliveryboy_id,
      product,
    });

    /**
     * Notify a deliveryboy a new Delivery
     */

    await Queue.add(NotificationMail.key, {
      deliveryboy,
      product,
      recipient,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryboy_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** End of Validations from Yup */

    const { deliveryId } = req.params;
    const { recipient_id, deliveryboy_id, product, signature_id } = req.body;

    const delivery = await Delivery.findByPk(deliveryId);

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    const deliveryboyExists = await Deliveryboy.findOne({
      where: { id: deliveryboy_id },
    });

    const signatureExists = await File.findOne({ where: { id: signature_id } });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (!deliveryboyExists) {
      return res.status(400).json({ error: 'Deliveryboy not found' });
    }

    if (!signatureExists) {
      return res.status(400).json({ error: 'Signature not found' });
    }

    const updateDelivery = await delivery.update({
      recipient_id,
      deliveryboy_id,
      product,
      signature_id,
    });

    return res.json(updateDelivery);
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (delivery.start_date !== null) {
      return res
        .status(400)
        .json({ error: "You can't delete a delivery started " });
    }

    if (!delivery) {
      res.status(400).json({ error: 'Delivery not found' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryController();
