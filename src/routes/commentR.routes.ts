import { Router } from "express";

import { addComment, addReply, deleteCommentUser, getAllComment, getCommentWithProduct, getReplyWithProductAndComment, paginationComment } from "../controllers/commentReply.controller";

const CommentReplyRoutes = Router()

CommentReplyRoutes.get('/', getAllComment),
CommentReplyRoutes.get('/all/:productId', getCommentWithProduct)
CommentReplyRoutes.get('/:productId/:n/:p', paginationComment)
CommentReplyRoutes.post('/', addComment)
CommentReplyRoutes.delete('/:commentId', deleteCommentUser)
//reply
CommentReplyRoutes.get('/reply/product/:productId/:commentRId', getReplyWithProductAndComment)
CommentReplyRoutes.post('/reply', addReply)
export default CommentReplyRoutes