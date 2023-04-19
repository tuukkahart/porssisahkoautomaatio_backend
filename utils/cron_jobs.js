const cron = require('node-cron');
const { fetchLatestPriceData } = require('./stock_exchange_electricity');

exports.initScheduledJobs = () => {

    const scheduledFetch = cron.schedule('0 6,12,18,24 * * *', () => {
        console.log('fetching data from api...')
        fetchLatestPriceData
    });
    
    scheduledFetch.start();
}



