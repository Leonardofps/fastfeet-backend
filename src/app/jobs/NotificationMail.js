import Mail from '../../lib/Mail';

class NotificationMail {
  get key() {
    return 'NotificationMail';
  }

  async handle({ data }) {
    const { deliveryboy, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryboy.name} <${deliveryboy.email}>`,
      subject: 'Você tem uma nova entrega disponível',
      template: 'notification',
      context: {
        deliveryboy: deliveryboy.name,
        product,
        recipientName: recipient.name,
        recipient: recipient.street,
        recipientNumber: recipient.number,
        city: recipient.city,
        state: recipient.state,
      },
    });
  }
}

export default new NotificationMail();
