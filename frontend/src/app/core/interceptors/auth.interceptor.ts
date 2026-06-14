import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((err) => {
      // Token expirado/inválido → encerra a sessão e volta ao login.
      // Ignora as rotas de autenticação (ex.: senha incorreta no próprio login).
      if (err?.status === 401 && !req.url.includes('/auth/')) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
};
