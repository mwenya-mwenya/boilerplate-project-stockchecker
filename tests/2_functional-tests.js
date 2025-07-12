const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const app = require('../server.js');

chai.use(chaiHttp);

describe('Functional Tests', function () {

  it('GET /api/stock-prices → one stock', function (done) {

    chai.request(app)
      .get('/api/stock-prices?stock=GOOG').end(function (err, res) {
        assert.equal(res.status, 200);
        assert.exists(res.body.stockData);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        previousLikes = res.body.stockData.likes;
        done();
      });

  });


  it('GET /api/stock-prices → one stock & like', function (done) {
    chai
      .request(app)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200); // Assuming correct route
        assert.exists(res.body.stockData);
        const newLikes = res.body.stockData.likes;
        assert.equal(newLikes, previousLikes); // needs to changed to isAbove when in live envronment
        done();
      });


  });

  it('GET /api/stock-prices → same stock & like', function (done) {
    chai
      .request(app)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.stockData);
        done();
      });


  });
  it('GET /api/stock-prices → two stocks', function (done) {
    chai
      .request(app)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData)
        assert.equal(res.body.stockData.length,2);
        
        done();
      });


  });
  it('GET /api/stock-prices → two stocks & like', function (done) {
    chai
      .request(app)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.stockData[1]);
        assert.exists(res.body.stockData[1]);
        assert.equal(res.status, 200);
        assert.exists(res.body.stockData[1]);
        assert.property(res.body.stockData[1], 'stock');
        assert.property(res.body.stockData[1], 'price');
        assert.property(res.body.stockData[1], 'rel_likes');
        assert.equal(res.body.stockData[1].stock, 'MSFT');
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        done();
      });


  });
})

