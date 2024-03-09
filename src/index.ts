import express from 'express'
import productsRoutes from './routes/products.routes'
const app = express()
import variantRoutes from './routes/variants.routes'
import databaseService from './services/database.services'
const port = 3001
import cors, { CorsOptions } from 'cors'
import cartRoutes from './routes/cart.routes'
import usersRoutes from './routes/user.routes'
import newsRoutes from './routes/news.routes'
import authRoutes from './routes/auth/auth.routes'
import vnpayRouters from './routes/vnpay.routes'
import CommentRoutes from './routes/comment.routes'
import OrderRouters from './routes/order.routes'
import categoryRoutes from './routes/category.routes'
import revenueRouters from './routes/revenue.routes'
import giftRoutes from './routes/gift.routes'
import sliderRoutes from './routes/slider.routes'
import CommentReplyRoutes from './routes/commentR.routes'

process.env.TZ = 'Asia/Ho_Chi_Minh'
app.use(express.json())

databaseService.connect()

const corsOptions: CorsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.use('/products', productsRoutes)
app.use('/cart', cartRoutes)
app.use('/variants', variantRoutes)
app.use('/users', usersRoutes)
app.use('/news', newsRoutes)
app.use('/auth', authRoutes)
app.use('/order', OrderRouters)
app.use('/vnpay', vnpayRouters)
app.use('/revenue', revenueRouters)
app.use('/comment', CommentRoutes)
app.use('/category', categoryRoutes)
app.use('/gift', giftRoutes)
app.use('/slider', sliderRoutes)
app.use('/cmt-reply', CommentReplyRoutes)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})