import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService, AlertService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    userDetails;
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService
    ) {
        
    }

    ngOnInit() {
        
        if(this.userService.currentUser) {
            this.userDetails = this.userService.currentUser;
            this.getAllUsers();
        } else {
            this.router.navigate(['/login']);
        }
    }

    getAllUsers() {
        this.userService
            .getAll()
            .subscribe(data=>{
                if(data) {
                    this.users = data;
                }
        })
    }

    logout() {
        
        this.userService.deleteToken();
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    deleteUser(id: any) {
        let postData = {
            key: id
        };
        
        this.userService
            .delete(postData)
            .subscribe(data=>{
                if(data){
                    this.alertService.success("User has been deleted successfully!!!", true);
                    this.getAllUsers();
                }
        })
    }
}