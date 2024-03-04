"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const app = (0, express_1.default)();
const variants_routes_1 = __importDefault(require("./routes/variants.routes"));
const database_services_1 = __importDefault(require("./services/database.services"));
const port = 3001;
const cors_1 = __importDefault(require("cors"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth/auth.routes"));
const vnpay_routes_1 = __importDefault(require("./routes/vnpay.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const revenue_routes_1 = __importDefault(require("./routes/revenue.routes"));
const gift_routes_1 = __importDefault(require("./routes/gift.routes"));
const slider_routes_1 = __importDefault(require("./routes/slider.routes"));
process.env.TZ = 'Asia/Ho_Chi_Minh';
app.use(express_1.default.json());
database_services_1.default.connect();
const corsOptions = {
    origin: '*'
};
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/products', products_routes_1.default);
app.use('/cart', cart_routes_1.default);
app.use('/variants', variants_routes_1.default);
app.use('/users', user_routes_1.default);
app.use('/news', news_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/order', order_routes_1.default);
app.use('/vnpay', vnpay_routes_1.default);
app.use('/revenue', revenue_routes_1.default);
app.use('/comment', comment_routes_1.default);
app.use('/category', category_routes_1.default);
app.use('/gift', gift_routes_1.default);
app.use('/slider', slider_routes_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
