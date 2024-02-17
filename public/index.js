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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
