
import Router  from "@koa/router";
import { detectFraud, getFraudAlerts } from "../controllers/fraudController";
import { getRiskLogs } from "../controllers/riskLogController";


const router = new Router({
   prefix: '/fraud'
});


router.post('/detect', detectFraud);
router.get('/alerts', getFraudAlerts);
router.get('/risk-logs', getRiskLogs);


export default router;
