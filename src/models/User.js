import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.statics.createUser = async function (
  firstName,
  lastName,
  userName,
  password
) {
  try {
    const user = await this.create({ firstName, lastName, userName, password });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByUserNamePassword = async function (
  userName,
  password
) {
  try {
    const user = await this.findOne({ userName, password });
    if (!user) throw { error: "User does not found" };
    return user;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("User", userSchema);
