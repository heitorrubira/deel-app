const app = require('./app');
const config = require('./config');

init();

async function init() {
  try {
    app.listen(config.port, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
