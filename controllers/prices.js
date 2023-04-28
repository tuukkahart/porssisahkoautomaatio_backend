const Price = require('../models/price');
const { fetchLatestPriceData } = require('../utils/stock_exchange_electricity');
const pricesRouter = require('Express').Router()

pricesRouter.get('/', async (request, response) => {
    
    const prices = await Price.find({});
    response.json(prices.sort((a,b) => new Date(a.startDate) - new Date(b.startDate)))

    
})


module.exports = pricesRouter