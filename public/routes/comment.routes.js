"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controllers_1 = require("../controllers/comment.controllers");
const CommentRoutes = (0, express_1.Router)();
CommentRoutes.get('/', comment_controllers_1.getAllComment);
CommentRoutes.get('/:productId/:n/:p', comment_controllers_1.paginationComment);
CommentRoutes.post('/', comment_controllers_1.addComment);
// CommentRoutes.put('/:newId', updateNews)
CommentRoutes.delete('/:commentId', comment_controllers_1.deleteCommentUser);
exports.default = CommentRoutes;
