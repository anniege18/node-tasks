import express from 'express';
import router from './routes';
import cookieParser from './middlewares/parse-cookie';
import queryParser from './middlewares/parse-query';

const app = express();

app.use(cookieParser);
app.use(queryParser);

app.use('/api', router);

export default app;