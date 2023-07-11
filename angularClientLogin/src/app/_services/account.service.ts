import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
      const headers = { 'Authorization': "Basic " + btoa(username + ":" + password)};
        return this.http.post<User>(`${environment.apiUrl}/user/login`, { username, password },{headers})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/user/registerUpdateUser`, user);
    }

    getAll() {
      const headers = { 'Authorization': "Basic " + btoa(this.userValue?.username + ":" + this.userValue?.password)};
        return this.http.get<User[]>(`${environment.apiUrl}/user/getUsers`, {headers});
    }

    getById(id: string) {
      const headers = { 'Authorization': "Basic " + btoa(this.userValue?.username + ":" + this.userValue?.password)};
        return this.http.get<any>(`${environment.apiUrl}/user/getUser`, {headers});
    }

    update(id: string, params: any) {
        return this.http.post(`${environment.apiUrl}/user/registerUpdateUser`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

  isAlphaNumeric(str: string) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

  isHavingSpecialChar(str: string) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if(format.test(str)){
      return true;
    } else {
      return false;
    }
  };

  isHavingNumbers(str: string) {
    const regex = /\d/;
    if(regex.test(str)){
      return true;
    } else {
      return false;
    }
  };

  containsUppercase(str: string) {
    //return /^(?=.*[a-z])(?=.*[A-Z].*$)/.test(str);
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (code > 64 && code < 91) {  // upper alpha (A-Z)

        return true;
      }
    }
    return false;
  };

}
