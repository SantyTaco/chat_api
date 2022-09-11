import ConversationModel from "../models/Conversation.js";
import MessageModel from "../models/Message.js";
import UserModel from "../models/User.js";

export default {
  initiate: async (req, res) => {
    try {
      const { participants } = req.body;
      const { userId: creator } = req;
      const allUserIds = [...participants, creator];
      const conversation = await ConversationModel.initiateConversation(
        allUserIds,
        creator
      );
      return res
        .status(200)
        .json({ success: true, conversation: conversation });
    } catch (error) {
      console.log("Error", error);
      return res.status(500).json({ success: false, error: error });
    }
  },
  createMessage: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const message = req.body.messageText;
      const loggedUser = req.userId;
      const post = await MessageModel.createMessageInConversation(
        conversationId,
        message,
        loggedUser
      );
      return res.status(200).json({ success: true, post });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ success: false, error: error });
    }
  },
  getConversations: async (req, res) => {
    try {
      const loggedUser = req.userId;
      const conversations = await ConversationModel.getConversationsByUserId(
        loggedUser
      );

      return res
        .status(200)
        .json({ success: true, conversations: conversations });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getFilterConversations: async (req, res) => {
    try {
      let filterConversation = [];
      const loggedUser = req.userId;
      const userId = req.query?.userId || "";
      const startDate = req.query?.startDate || "";
      const endDate = req.query?.endDate || "";

      const conversations = await ConversationModel.getConversationsByUserId(
        loggedUser
      );

      filterConversation = filterByUserAndRangeDate(
        userId,
        startDate,
        endDate,
        filterConversation,
        conversations
      );

      return res
        .status(200)
        .json({ success: true, conversations: filterConversation });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ success: false, error: error });
    }
  },
  searchMessagesByText: async (req, res) => {
    try {
      const { conversationId } = req.params || "";
      const searchText = req.query?.text || "";

      const messages = await MessageModel.getMessagesByConversationId(
        conversationId
      );
      const searchMessages = messages.filter((message) => {
        const existText = message.message.includes(searchText);
        return existText;
      });
      return res.status(200).json({
        success: true,
        searchMessages,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
};

function filterByUserAndRangeDate(
  userId,
  startDate,
  endDate,
  filterConversation,
  conversations
) {
  if (userId && !startDate && !endDate) {
    filterConversation = conversations.filter((conversation) =>
      conversation?.participants?.includes(userId)
    );
  } else if (userId && startDate && endDate) {
    filterConversation = conversations.filter((conversation) => {
      const conversationDate = new Date(conversation?.createdAt);
      const isParticipant = conversation?.participants?.includes(userId);
      const isInRangeTime =
        conversationDate >= new Date(startDate) &&
        conversationDate <= new Date(endDate);

      return isParticipant && isInRangeTime;
    });
  } else if (!userId && startDate && endDate) {
    filterConversation = conversations.filter((conversation) => {
      const conversationDate = new Date(conversation?.createdAt);
      return (
        conversationDate >= new Date(startDate) &&
        conversationDate <= new Date(endDate)
      );
    });
  }
  return filterConversation;
}
