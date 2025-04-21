import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';
import { AuthService } from '../servicios/auth.service';
import { inject } from '@angular/core';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const isApiAuth = req.url.includes("api/auth");
 
  if (!tokenService.isLogged() || isApiAuth ) {
    return next(req);
  }
 
  const token = tokenService.getToken();
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
 
  return next(authReq);
};