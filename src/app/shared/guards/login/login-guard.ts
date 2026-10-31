import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('userlist');

    if (user) {
      this.router.navigate(['/tabs']);
      console.log('Authorized user there!');
      return false;
    }

    return true;
  }
}
