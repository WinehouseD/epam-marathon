import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { LoaderService } from 'src/app/shared/components/epm-loader/loader.service';
import { environment } from 'src/environments/environment.prod';

export const loaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loaderService = inject(LoaderService);

  if (
    req.url.includes(`${environment.apiBaseUrl}/users`) ||
    req.url.includes(`${environment.apiBaseUrl}/match?limit`)
  ) {
    return next(req).pipe(
      tap(() => loaderService.showLoader()),
      finalize(() => loaderService.hideLoader())
    );
  }

  return next(req);
};
