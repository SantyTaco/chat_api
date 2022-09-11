import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    participants: Array,
    creator: String,
  },
  {
    timestamps: true,
    collection: "conversations",
  }
);

conversationSchema.statics.initiateConversation = async function (
	participants, creator
) {
  try {
    const availableConversation = await this.findOne({
        participants: {
        $size: participants.length,
        $all: [...participants],
      },
    });
    if (availableConversation) {
      return {
        isNewConversation: false,
        message: 'The conversation exists',
        conversationId: availableConversation._doc._id,
        creator: availableConversation._doc.creator,
      };
    }

    const newConversation = await this.create({ participants, creator });
    return {
        isNewConversation: true,
      message: 'Creating a new conversation',
      conversationId: newConversation._doc._id,
      creator: newConversation._doc.creator,
    };
  } catch (error) {
    console.log('error on start conversation method', error);
    throw error;
  }
};

conversationSchema.statics.getConversationsByUserId = async function (userId) {
    console.log('userId', userId);
    try {
      const conversations = await this.find({ participants: { $all: [userId] } });
      return conversations;
    } catch (error) {
      throw error;
    }
  }

  conversationSchema.statics.getConversationByRoomId = async function (conversationId) {
    try {
      const room = await this.findOne({ _id: conversationId });
      return room;
    } catch (error) {
      throw error;
    }
  }

export default mongoose.model("Conversation", conversationSchema);
