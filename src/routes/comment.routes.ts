import { Router } from "express";

import { addComment, deleteCommentUser, getAllComment, getCommentWithProduct } from "../controllers/comment.controllers";

const CommentRoutes = Router()

CommentRoutes.get('/', getAllComment)
CommentRoutes.get('/:productId', getCommentWithProduct)
CommentRoutes.post('/', addComment)
// CommentRoutes.put('/:newId', updateNews)
CommentRoutes.delete('/:commentId', deleteCommentUser)

export default CommentRoutes