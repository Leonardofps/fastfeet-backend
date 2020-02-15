import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().notRequired(),
      complement: Yup.string().notRequired(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    /* const recipientExists = await Recipient.findOne({
      where: { email: req.body.email },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    } */

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().notRequired(),
      complement: Yup.string().notRequired(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      res.status(400).json({ error: 'Recipient not found' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }
}

export default new RecipientController();
