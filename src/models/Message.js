import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4()
    },
    conversationId: String,
    message: String,
    postedByUser: String,
  },
  {
    timestamps: true,
    collection: "messages",
  }
);


messageSchema.statics.createMessageInConversation = async function (conversationId, message, postedByUser) {
  try {
    const post = await this.create({
      conversationId,
      message,
      postedByUser,
    });
  
    return post;
  } catch (error) {
    throw error;
  }
}

messageSchema.statics.getMessagesByConversationId = async function (conversationId) {
    try {
      const messages = await this.find({ conversationId: conversationId });
      return messages;
    } catch (error) {
      throw error;
    }
  }

export default mongoose.model("Message", messageSchema);