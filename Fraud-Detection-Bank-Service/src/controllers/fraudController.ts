import { Context } from "koa";
import { FraudDetector } from "../services/fraudDetector";
import { TransactionEvent } from "../interfaces";
import { getFraudAlertsByAccountId } from "../repository/fraudRepo";
import { kafkaProducer } from "../kafka/producers/transaction.producer";
import config from "../config/env";


export const detectFraud = async (ctx: Context) => {
  try {
    const transaction = ctx.request.body as TransactionEvent;


    if(!transaction.transactionId){
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: 'Transaction ID is required',
        timestamp: new Date().toISOString(),
      };
      return;
    }
    await kafkaProducer.send({
      topic: config.kafka.transactionIncomingTopic,
      messages: [{ value: JSON.stringify(transaction) }],
    });
    ctx.status = 202;
    ctx.body = {
      status: 202,
      message: "Transaction received for fraud evaluation",
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    };
  }
};


export const getFraudAlerts = async (ctx: Context) => {
  try {
    const accountId = ctx.query.accountId as string;


    if (!accountId) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: "Missing accountId in query parameters",
        timestamp: new Date().toISOString(),
      };
      return;
    }


    const alerts = await getFraudAlertsByAccountId(accountId);


    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "Fraud alerts fetched successfully",
      timestamp: new Date().toISOString(),
      data: alerts,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    };
  }
};
