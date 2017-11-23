import express from 'express';
import { router, routerDB } from './routes';
import cookieParser from './middlewares/parse-cookie';
import queryParser from './middlewares/parse-query';
import './utils';

const app = express();

app.use(cookieParser);
app.use(queryParser);

app.get('/', (req, res)=>{
    res.send('Hello world!');
});

app.use('/api', router);
app.use('/db', routerDB);

export default app;