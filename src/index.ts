import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';

// создание приложения
const app = express();
setupApp(app);

const PORT = SETTINGS.PORT;

// ф-ия listen - запускает сервер и начинает прослушивать входящие запросы на указанном порту.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
