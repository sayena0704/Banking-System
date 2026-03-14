import Router from '@koa/router';
import { healthCheck } from '../controllers/healthController';


const router = new Router();


router.get('/health', healthCheck);


export default router;
