require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { getAgeDistribution } = require('./src/controllers/analyticsController');

async function test() {
  const req = {};
  const res = {
    status: (code) => {
      console.log('Status:', code);
      return res;
    },
    json: (data) => {
      console.log('JSON:', JSON.stringify(data, null, 2));
    }
  };
  
  await getAgeDistribution(req, res);
}

test();
