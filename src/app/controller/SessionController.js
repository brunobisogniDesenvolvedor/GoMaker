import jwt from 'jsonwebtoken';

import authConfig from '../../config/Auth';

import User from '../models/User';

class SessionControler {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(401)
        .json({ error: 'Senha não corresponde a cadastrada' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },

      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionControler();
