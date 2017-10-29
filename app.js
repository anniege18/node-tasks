import express from 'express';
import router from './routes';
const app = express();

import cookieParser from './middlewares/parse-cookie';
import queryParser from './middlewares/parse-query';

app.use(cookieParser);
app.use(queryParser);

app.use('/api', router);

// app.get('*', (req, res) => {
//   res.write(JSON.stringify(req.parsedCookies, null, 4));
//   res.write('\n');
//   res.write(JSON.stringify(req.parsedQuery, null, 4));
//   res.end();
// });

export default app;