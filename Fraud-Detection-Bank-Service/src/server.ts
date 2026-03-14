import app from './app';
import config from './config/env';
import { connectDB } from './db';
import { startTransactionConsumer } from './kafka/consumers/transaction.consumer';
import { initProducer } from './kafka/producers/transaction.producer';




const PORT = config.server.port;


const startServer = async () => {
  try {


    await connectDB();


    await initProducer();


    await startTransactionConsumer();


    app.listen(PORT, () => {
      console.log(`Fraud detection service is running on port ${PORT}`);
    });


  } catch (error) {
    console.error("Failed to start service", error);
    process.exit(1);
  }
};


startServer();
