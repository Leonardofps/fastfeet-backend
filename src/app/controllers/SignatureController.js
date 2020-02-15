import File from '../models/File';

class SignatureController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const signature = await File.create({
      name,
      path,
    });
    return res.json(signature);
  }
}

export default new SignatureController();
