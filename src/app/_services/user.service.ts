import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {


    auth_email: string;
    auth_token: string;
    auth_id: string;
    auth_fullname: any;
    auth_password: any;

    redirectUrl: string;
    currentUser: User;

    noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };


    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/allUsers`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }

    register(user: any) {
        return this.http.post<any>(`${environment.apiUrl}/api/register`, user)
            .pipe(map(user => {
                if (user) {
                    return user;    
                }
            }));
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/${user._id}`, user);
    }

    

    delete(postData: any) {
        return this.http.post<any>(`${environment.apiUrl}/api/deleteUsers`, postData)
            .pipe(map(user => {
                if (user) {
                    return user;
                }
            }));
    }

    getUserProfile() {
        return this.http
            .get(`${environment.apiUrl}'/api/userProfile`)
            .pipe(map(user => {
                if (user) {
                    return user;
                }
            }));
    }

    isLoggedIn() {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            return true;
        } else {
            return false;
        }
    }

    getLoginUser() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.auth_email = this.currentUser.email;
        this.auth_token = this.currentUser.token;
        this.auth_fullname = this.currentUser.fullName;
        this.auth_password = this.currentUser.password;
        this.auth_id = this.currentUser._id;
        return this.currentUser;
    }


    setToken(user: any) {
        
        // localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.auth_email = user.email;
        this.auth_token = user.token;
        this.auth_id = user._id;
        this.auth_fullname = user.fullname;
        this.auth_password = user.password;
        
    }

    getToken() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    deleteToken() {

        localStorage.removeItem('currentUser');
        this.auth_email = '';
        this.auth_token = '';
        this.auth_id = '';
        this.auth_fullname = '';
        this.auth_password = '';

        this.currentUser = null;
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.auth_email = '';
        this.auth_token = '';
        this.auth_id = '';
        this.auth_fullname = '';
        this.auth_password = '';
    }
}