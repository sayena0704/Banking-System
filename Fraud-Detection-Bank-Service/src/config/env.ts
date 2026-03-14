import dotenv from 'dotenv';


dotenv.config();


const requireEnv = (name: string): string => {
    const value = process.env[name];
    if(!value) {
        throw new Error(`Missing required environment variable : ${name}`);
    }
    return value;
};


export const config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
  },


  db: {
    host: requireEnv("DB_HOST"),
    port: parseInt(requireEnv("DB_PORT"), 10),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    name: requireEnv("DB_NAME"),
  },


  kafka: {
    broker: requireEnv("KAFKA_BROKER"),
    clientId: requireEnv("KAFKA_CLIENT_ID"),
    groupId: requireEnv("KAFKA_GROUP_ID"),
    transactionIncomingTopic: requireEnv("KAFKA_TRANSACTION_INCOMING_TOPIC"),
    transactionResultTopic: requireEnv("KAFKA_TRANSACTION_RESULT_TOPIC")
  },
};


export default config;
