import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { STORAGE_KEY } from 'src/app/app.config';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

const setToken = (request: HttpRequest<any>): HttpRequest<any> => {
  const token = window.sessionStorage.getItem(STORAGE_KEY.accessToken);
  const bearer = `Bearer ${token}`;
  const header = { Authorization: bearer };
  return request.clone({ setHeaders: header });
};
