import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponseData, LoginResponseData } from './responses.model';
import { User } from './user.model';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  logOutIntervalRef;
  constructor(private http: HttpClient, private router: Router) {}
  signUp(email: string, password: string) {
    return this.onAuthResponse(
      this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.apiKey,
        { email, password, returnSecureToken: true }
      )
    );
  }

  signIn(email: string, password: string) {
    return this.onAuthResponse(
      this.http.post<LoginResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.apiKey,
        { email, password, returnSecureToken: true }
      )
    );
  }
  onAuthResponse(
    authResponse: Observable<AuthResponseData | LoginResponseData>
  ) {
    return authResponse.pipe(
      catchError(this.handleError),
      tap((response) =>
        this.handleResponse(
          response.email,
          response.idToken,
          +response.expiresIn,
          response.localId
        )
      )
    );
  }
  handleResponse(
    email: string,
    token: string,
    expiresIn: number,
    id: string
  ): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.autoLogOut(expiresIn * 1000);
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    let errorMes = 'An unknown error occured';
    if (!error.error || !error.error.error) {
      return throwError(errorMes);
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS': {
        errorMes = 'There is already a user registered with that email';
        break;
      }
      case 'EMAIL_NOT_FOUND': {
        errorMes = 'Incorrect credentials';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMes = 'Incorrect credentials';
        break;
      }
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this accou…setting your password or you can try again later.': {
        errorMes = 'Too many login attempts, try later';
        break;
      }
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.': {
        errorMes = 'Too many login attempts, try later';
        break;
      }
    }
    return throwError(errorMes);
  }
  logOut() {
    this.user.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
    if (this.logOutIntervalRef) {
      clearInterval(this.logOutIntervalRef);
    }
  }

  autoLogin() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      return this.user.next(null);
    }

    let tokenExpirationDate = new Date(userData._tokenExpirationDate);
    let user = new User(
      userData.email,
      userData.id,
      userData._token,
      tokenExpirationDate
    );

    this.user.next(user);
    let sessionDuration = tokenExpirationDate.getTime() - new Date().getTime();
    this.autoLogOut(sessionDuration);
  }
  autoLogOut(sessionDuration: number) {
    this.logOutIntervalRef = this.logOutIntervalRef = setTimeout(() => {
      this.logOut();
    }, sessionDuration);
  }
}
