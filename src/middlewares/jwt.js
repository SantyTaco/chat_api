import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const SECRET_KEY = 'b44c6ff3-d72a-432f-9a4a-ea6c2e794442';

export const encode = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await UserModel.getUserByUserNamePassword(userName, password);
        const payload = {
          userId: user._id,
          userName: user.userName,
        };
        const authToken = jwt.sign(payload, SECRET_KEY);
        console.log('Auth', authToken);
        req.authToken = authToken;
        next();
      } catch (error) {
        return res.status(400).json({ success: false, message: error.error });
      }
}

export const decode = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ success: false, message: 'No access token provided' });
      }
      const accessToken = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId;
        return next();
      } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
      }
}

