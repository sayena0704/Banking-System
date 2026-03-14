
import { kafka } from '../index';


export const kafkaProducer = kafka.producer();


export const initProducer = async () => {
    try{
        await kafkaProducer.connect();
        console.log('kafka producer connected');
    } catch (error) {
        console.error('Producer connection failed', error);
    }
};


export const sendMessage = async (topic: string, message: any) => {
  try {
    await kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });


    console.log(`Message sent to topic: ${topic}`);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


