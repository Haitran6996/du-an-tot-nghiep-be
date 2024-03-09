"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentReply_controller_1 = require("../controllers/commentReply.controller");
const CommentReplyRoutes = (0, express_1.Router)();
CommentReplyRoutes.get('/', commentReply_controller_1.getAllComment),
    CommentReplyRoutes.get('/all/:productId', commentReply_controller_1.getCommentWithProduct);
CommentReplyRoutes.get('/:productId/:n/:p', commentReply_controller_1.paginationComment);
CommentReplyRoutes.post('/', commentReply_controller_1.addComment);
CommentReplyRoutes.delete('/:commentId', commentReply_controller_1.deleteCommentUser);
//reply
CommentReplyRoutes.get('/reply/product/:productId/:commentRId', commentReply_controller_1.getReplyWithProductAndComment);
CommentReplyRoutes.post('/reply', commentReply_controller_1.addReply);
exports.default = CommentReplyRoutes;
