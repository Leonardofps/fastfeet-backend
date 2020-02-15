import * as Yup from 'yup';

import Deliveryboy from '../models/Deliveryboy';
import File from '../models/File';

class DeliveryboyController {
  async index(req, res) {
    const deliveryboy = await Deliveryboy.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveryboy);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** End of Validations from Yup */

    const deliveryboyExists = await Deliveryboy.findOne({
      where: { email: req.body.email },
    });
    if (deliveryboyExists) {
      return res.status(400).json({ error: 'Deliveryboy already exists.' });
    }

    const { id, name, email } = await Deliveryboy.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** End of Yup validations for update */

    const { email } = req.body;

    const deliveryboy = await Deliveryboy.findByPk(req.params.id);

    if (!deliveryboy) {
      return res.status(400).json({ error: 'Deliveryboy not found' });
    }

    if (email && email !== deliveryboy.email) {
      const deliveryboyExists = await Deliveryboy.findOne({ where: { email } });

      if (deliveryboyExists) {
        return res.status(400).json({ error: 'Deliveryboy already exists' });
      }
    }

    const { id, name } = await deliveryboy.update(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const deliveryboy = await Deliveryboy.findByPk(req.params.id);

    if (!deliveryboy) {
      return res.status(400).json({ error: 'Deliveryboy not found' });
    }

    await deliveryboy.destroy();

    return res.json({ success: 'Deliveryboy was deleted' });
  }
}

export default new DeliveryboyController();
