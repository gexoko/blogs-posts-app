import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../settings/config';

// Basic Auth: пропускает дальше только запросы с корректными логином и паролем супер-админа.
export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'] as string; // 'Basic xxxx'

  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== 'Basic' || !token) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  // Декодируем base64 и разбираем на логин и пароль.
  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const separatorIndex = credentials.indexOf(':');

  if (separatorIndex === -1) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next();
};
