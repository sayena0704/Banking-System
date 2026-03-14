import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import healthRoutes from './routes/health.route';
import authRoutes from './routes/auth.routes';
import Router from '@koa/router';
import { correlationId } from './middlewares/correlation.middleware';
import { errorMiddleware } from './middlewares/error.middleware';



const app = new Koa();
const router = new Router();


app.use(errorMiddleware);
app.use(correlationId);
app.use(bodyParser());


router.use(authRoutes.routes());
router.use(healthRoutes.routes());


app.use(router.routes());
app.use(router.allowedMethods());


export default app;







