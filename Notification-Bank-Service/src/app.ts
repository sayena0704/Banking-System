import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import healthRoutes from './routes/health.routes';

const app = new Koa();

app.use(bodyParser());
app.use(healthRoutes.routes());
app.use(healthRoutes.allowedMethods());

export default app;