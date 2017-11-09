import express from 'express';
import { routerJWT, routerPassport } from './routes';
import cookieParser from './middlewares/parse-cookie';
import queryParser from './middlewares/parse-query';

const app = express();

app.use(cookieParser);
app.use(queryParser);

app.get('/', (req, res)=>{
    res.send('Hello world!');
});
app.use('/api-pass', routerPassport);
app.use('/api-jwt', routerJWT);

export default app;