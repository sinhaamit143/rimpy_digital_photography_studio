require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const app = require('./src/app');

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
