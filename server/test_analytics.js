require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { getDeviceBreakdown, getAnalytics } = require('./src/controllers/analyticsController');

async function test() {
  const req = {};
  const res = {
    status: (code) => {
      console.log('Status:', code);
      return res;
    },
    json: (data) => {
      console.log('JSON:', data);
    }
  };
  
  await getDeviceBreakdown(req, res);
}

test();
