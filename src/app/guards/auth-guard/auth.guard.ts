import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
  
    return of(this.authenticationService.isUserLoggedIn()).pipe(
      tap(loggedIn => {
        if (!loggedIn) {
            this.router.navigate(['/login'], { queryParams: { url: state.url } });
        }
      })
    );
  
    // REMOVAL AUTH0 - não tem mais necessidade
    // return this.auth.isAuthenticated$.pipe(
    //   tap(loggedIn => {
    //     if (!loggedIn) {
    //       this.auth.login(state.url);
    //     }
    //   })
    // )
  }

}
