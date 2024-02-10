import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/auth.routes.js';
import { usersRoutes } from './routes/users.routes.js';
import { tasksRoutes } from './routes/tasks.routes.js';
import { listsRoutes } from './routes/lists.routes.js';
import { boardsRoutes } from './routes/boards.routes.js';

const app = express();
const PORT = process.env.PORT ?? 1234;

const ACCEPTED = [
  "http://localhost:5173"
]

app.use(json(), morgan('dev'), cookieParser(), cors({
  // origin:'http://localhost:5173'
  credentials: true,
  origin: (origin, callback) => {
    return callback(null, true)
  },
}))
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/tasks', tasksRoutes);
app.use('/lists', listsRoutes);
app.use('/boards', boardsRoutes);


app.use('/*', (req, res) => {
  console.error('Source Not Found');
  res.status(404).end();
})

app.listen(PORT, () => {
  console.log(`-- Server listening on port http://localhost:${PORT}`);
})