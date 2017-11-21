import express from 'express';
import router from './routes';
import cookieParser from './middlewares/parse-cookie';
import queryParser from './middlewares/parse-query';

import './utils/databaseUtils';

import promise from './helpers/parseCSV';
promise.then(data => console.log('data', typeof data));

const app = express();

app.use(cookieParser);
app.use(queryParser);

app.get('/', (req, res)=>{
    res.send('Hello world!');
});
app.use('/api', router);

export default app;