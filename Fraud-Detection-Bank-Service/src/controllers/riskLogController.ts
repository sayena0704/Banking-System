import { Context } from "koa";
import { geFilteredtRiskLogs } from "../repository/riskLogsRepo";


export const getRiskLogs = async ( ctx: Context ) => {
   try {
      const accountId = ctx.query.accountId as string;


      if(!accountId){
        ctx.status = 400;
        ctx.body = {
            status: 400,
            message: "Missing accountId in query parameters",
            timestamp: new Date().toISOString(),
        };
        return;
      }


    const filters = {
      status: ctx.query.status as string | undefined,
      isFraud: ctx.query.isFraud as string | undefined,
      minScore: ctx.query.minScore as string | undefined,
      maxScore: ctx.query.maxScore as string | undefined,
      transactionId: ctx.query.transactionId as string | undefined,
      page: Number(ctx.query.page) || 1,
      limit: Number(ctx.query.limit) || 10
    };
      const logs = await geFilteredtRiskLogs(accountId, filters);


      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: 'Risk logs fetched successfully',
        timestamp: new Date().toISOString(),
        data: logs
      };
   } catch (error) {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    }
   }
};




