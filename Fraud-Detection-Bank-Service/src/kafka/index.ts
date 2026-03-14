// Kafka client


import { Kafka, Producer, Consumer } from "kafkajs";
import config from "../config/env";


const kafka = new Kafka({
    clientId: config.kafka.clientId,
    brokers: [config.kafka.broker],
});


const producer : Producer = kafka.producer();


const createConsumer = (groupId: string): Consumer => {
    return kafka.consumer({ groupId });
};


export { kafka, producer, createConsumer };



