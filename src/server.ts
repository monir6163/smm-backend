import app from './app';
import config from './app/config';

async function main() {
  try {
    app.listen(process.env.PORT || config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
