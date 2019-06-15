import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from "@app/_services";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService,
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
          let url: string = state.url;
          return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {

      if (this.userService.isLoggedIn()) {
        this.userService.getLoginUser();
        return true;
      }
    
      // Store the attempted URL for redirecting
      this.userService.redirectUrl = url;
  
      // Navigate to the login page with extras
      this.router.navigate(['/login']);
      return false;
    }
}