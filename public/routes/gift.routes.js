"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gift_controllers_1 = require("../controllers/gift.controllers");
const NewsRoutes = (0, express_1.Router)();
NewsRoutes.get('/pagination/:n/:p', gift_controllers_1.paginationGift);
NewsRoutes.get('/:code', gift_controllers_1.getGiftWithCode);
NewsRoutes.get('/', gift_controllers_1.getAllGift);
NewsRoutes.post('/', gift_controllers_1.addGift);
NewsRoutes.put('/:giftId', gift_controllers_1.updateGift);
NewsRoutes.delete('/:giftId', gift_controllers_1.deleteGift);
exports.default = NewsRoutes;
