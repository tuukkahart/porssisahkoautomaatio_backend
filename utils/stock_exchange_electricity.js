//funktio joka hakee rajapinnasta
const Price = require('../models/price')
const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';
const axios = require('axios');

async function fetchLatestPriceData() {
    const response = await axios.get(LATEST_PRICES_ENDPOINT);
    const data = response.data
    console.log(data)

    
    await Price.deleteMany({})
  

    await data.prices.map(  (price) => {
        const newPrice = new Price ( {
            price: price.price,
            startDate: price.startDate,
            endDate: price.endDate
        })

        newPrice.save();
    })
}

module.exports = {fetchLatestPriceData}