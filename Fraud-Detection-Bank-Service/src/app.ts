import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from "koa-bodyparser";
import healthRoutes from './routes/healthRoutes';
import fraudRoutes from "./routes/fraudRoutes";


const app = new Koa();
const router = new Router();


app.use(bodyParser());


router.use(healthRoutes.routes());
router.use(fraudRoutes.routes());


app.use(router.routes());
app.use(router.allowedMethods());


export default app;

