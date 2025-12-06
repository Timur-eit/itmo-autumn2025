import express from 'express';
import passengersRouter from './routes/passengers.route';

const app = express();

app.use(express.json());

// Healthcheck
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Connect routers
app.use('/api/passengers', passengersRouter);

export default app;

// TODO Добавить middleware для ошибок ?
