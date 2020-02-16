import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryboy from '../models/Deliveryboy';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async show(req, res) {
    const { deliveryId } = req.params;
    const problems = await DeliveryProblems.findAll({
      where: { delivery_id: deliveryId },
    });

    const deliveryExists = await Delivery.findOne({
      where: { id: deliveryId },
    });

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery not exist' });
    }

    return res.json(problems);
  }

  async index(req, res) {
    const deliveryProblems = await DeliveryProblems.findAll();

    if (!deliveryProblems) {
      return res.status(400).json({
        error: 'It is not possible to find a deliveries with possible',
      });
    }

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** End of Validations from Yup */

    const { deliveryId } = req.params;
    const { description } = req.body;

    const deliveryExists = await Delivery.findOne({
      where: { id: deliveryId },
    });

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const delivery = await DeliveryProblems.create({
      delivery_id: deliveryId,
      description,
    });

    return res.json(delivery);
  }

  async delete(req, res) {
    const { problemId } = req.params;

    const problem = await DeliveryProblems.findByPk(problemId);

    if (!problem) {
      return res.status(400).json({ error: 'Problem not exist' });
    }

    const delivery = await Delivery.findOne({
      where: { id: problem.delivery_id },
      include: [
        {
          model: Deliveryboy,
          as: 'deliveryboy',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!delivery) {
      res.status(400).json({ error: 'Delivery not found' });
    }

    const cancel = await delivery.update({ canceled_at: new Date() });

    await Queue.add(CancellationMail.key, {
      delivery,
    });

    return res.json(cancel);
  }
}

export default new DeliveryProblemsController();
