import express from 'express';
import conversation from '../controllers/conversation.js';

const router = express.Router();

router
.get('/', conversation.getConversations)
.get('/filter', conversation.getFilterConversations)
.get('/:conversationId/search', conversation.searchMessagesByText)
  .post('/initiate', conversation.initiate)
  .post('/:conversationId/message', conversation.createMessage)

export default router;