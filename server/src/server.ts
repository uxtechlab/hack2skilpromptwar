import app from './app';
import { PORT } from './config/config';

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Clinic AI Assistant Backend Server      `);
  console.log(` Running on: http://localhost:${PORT}    `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
