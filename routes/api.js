'use strict';
const { resourceUsage } = require('process');
const getDB = require('../db.js')
const crypto = require('crypto')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {

      const stocks = Array.isArray(req.query.stock)
        ? req.query.stock.map(sym => sym.toLowerCase())
        : [req.query.stock.toLowerCase()];

      const like_status = req.query.like

      try {
        const hashedIp = await crypto.createHash('sha256').update(req.ip).digest('hex')

        const DB = await getDB()

        const stockData = await Promise.all(
          stocks.map(async (symbol) => {
            const res = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
            for (const symbol of stocks) {
              const existing = await DB.collection('LIKES').findOne({ hash: hashedIp, stockSymbol: symbol });

              if (like_status === 'true' && !existing) {
                await DB.collection('LIKES').insertOne({
                  hash: hashedIp,
                  stockSymbol: symbol,
                  likedAt: new Date()
                });
              }
            }
            const totalLikes = await DB.collection('LIKES').countDocuments({ stockSymbol: symbol });
            const data = await res.json();
            const stockData = { stock: data.symbol, price: data.close, likes: totalLikes };

            return stockData
          })
        );

        if (stockData.length === 1) {
          const oneSymbQuery = { stockData: stockData[0] }
          res.json(oneSymbQuery)
        } else {
          const formatedStockData = stockData.map((obj) => ({stock: obj.stock, price:obj.price, rel_likes:obj.likes}))
          const twoSymbQuery = { stockData: formatedStockData }
          res.json(twoSymbQuery)
        }



      } catch (error) {
        console.log(error)
      }
    })

};
