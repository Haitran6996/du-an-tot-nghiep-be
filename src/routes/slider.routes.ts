import { Router } from 'express'
import { addSlider, updateSlider,getOneSlider, getAllSlider, deleteSlider, paginationSlider } from '../controllers/slider.controllers'

const sliderRoutes = Router()

sliderRoutes.post('/add', addSlider)
sliderRoutes.put('/:sliderId', updateSlider)
sliderRoutes.delete('/delete/:sliderId', deleteSlider)
sliderRoutes.get('/', getAllSlider)
sliderRoutes.get('/:sliderId', getOneSlider)
sliderRoutes.get('/pagination/:n/:p', paginationSlider)


export default sliderRoutes