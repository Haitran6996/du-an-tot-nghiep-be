import express from 'express'
import productsRoutes from './routes/products.routes'
const app = express()
import variantRoutes from './routes/variants.routes'
import databaseService from './services/database.services'
const port = 3001
import cors, { CorsOptions } from 'cors'
import cartRoutes from './routes/cart.routes'

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
