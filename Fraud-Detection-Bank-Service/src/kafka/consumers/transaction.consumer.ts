import { createConsumer, kafka } from "../index";
import config from "../../config/env";
import { FraudDetector } from "../../services/fraudDetector";
import { TransactionEvent } from "../../interfaces";
import { kafkaProducer } from "../producers/transaction.producer";
import { saveFraudAlert } from "../../repository/fraudRepo";
import { saveRiskLogs, updateRiskLogStatus } from "../../repository/riskLogsRepo";


export const startTransactionConsumer = async () => {
    const consumer = createConsumer('fraud-service-group');


    await consumer.connect();
    console.log('Kafka Consumer connected: fraud-service-group');


    await consumer.subscribe({
        topic: config.kafka.transactionIncomingTopic,
        fromBeginning: false,
    });


    console.log(`Subscribe to topic: ${config.kafka.transactionIncomingTopic}`);


    await consumer.run({
         eachMessage: async ({message})  => {
            try {
                if(!message.value) return;


                const rawData = message.value.toString();
                const event: TransactionEvent = JSON.parse(rawData);


                console.log('Incoming transaction: ', event);


                //FRAUD DETECTION LOGIC
                const result = FraudDetector.evaluate(event);


                //SAVE RISK LOG
                await saveRiskLogs(event, "PENDING");




                if(result.isFraud) {
                    console.log('FRAUD DETECTED: ', result);
                    await updateRiskLogStatus(event.transactionId, "REJECTED", result);
                    await saveFraudAlert(event.accountId, result, event);
                    await kafkaProducer.send({
                        topic: config.kafka.transactionResultTopic,
                        messages: [{ value: JSON.stringify(result)}],
                    });
                } else {
                    console.log('Transaction is safe');
                    await updateRiskLogStatus(event.transactionId, "COMPLETED", result);
                }
            }catch (error) {
                console.error('Error processing transaction: ', error);
            }
         }
    });
};

