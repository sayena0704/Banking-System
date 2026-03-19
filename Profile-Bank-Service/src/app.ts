import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import healthRoutes from './routes/health.routes';
import profileRoutes from "./routes/profile.routes";
import { errorMiddleware } from './middlewares/error.middleware';
import { correlationId } from './middlewares/correlation.middleware';
import koaBody from 'koa-body';


const app = new Koa();
const router = new Router();


app.use(errorMiddleware);
app.use(correlationId);
// app.use(bodyParser());
app.use(
  koaBody({
    multipart: true,
    json: true,
    urlencoded: true,
    formidable: {
      uploadDir: "./upload_docs",
      keepExtensions: true,
    },
  })
);


router.use(healthRoutes.routes());
router.use(profileRoutes.routes());


app.use(router.routes());
app.use(router.allowedMethods());


export default app;

