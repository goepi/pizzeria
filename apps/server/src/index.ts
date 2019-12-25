import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { checkSession } from './checkSession';

const app = express();
app.use(cookieParser());
app.use(checkSession);

app.use(express.static(path.join(__dirname, '../../pizzeria-frontend/build')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../pizzeria-frontend/build', 'index.html'));
});

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
