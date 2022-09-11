
import UserModel from '../models/User.js';

export default {
    onCreateUser: async (req, res) => {
        try {
            const { firstName, lastName, userName, password } = req.body;
            const user = await UserModel.createUser(firstName, lastName, userName, password);
            return res.status(200).json({ success: true, user });
          } catch (error) {
            return res.status(500).json({ success: false, error: error })
          }
     },
  }