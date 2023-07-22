import { Injectable } from '@angular/core';
import { UserModel } from '../model/user.model';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticatedUser: UserModel | undefined;

  users: UserModel[] = [];

  constructor() {
    this.users.push({userId: UUID.UUID(), username: "user1", password: "123", roles: ["USER"]})
    this.users.push({userId: UUID.UUID(), username: "user2", password: "123", roles: ["USER"]})
    this.users.push({userId: UUID.UUID(), username: "admin", password: "admin123", roles: ["ADMIN"]})
   }

   public login(userName: string, password: string): Observable<UserModel>{
    let user = this.users.find(u => u.username == userName);
    if(!user) return throwError(()=> new Error('User not found'));
    if(user?.password != password) return throwError(()=> new Error('Username or password incorrect'));
    return of(user);
   }

   public authenticateUser(user: UserModel): Observable<boolean>{
    this.authenticatedUser = user;

    localStorage.setItem("authUser", JSON.stringify({userId: user.userId,
      username: user.username, role: user.roles, jwt: "JW_TOKEN"
    }));

    return of(true);
   }

   public hasRole(role: string): boolean{
    return this.authenticatedUser!.roles.includes(role);
   }

   public isAuthenticateUser():boolean{
    return this.authenticatedUser != undefined;
   }

   public logout(): Observable<boolean> {
    this.authenticatedUser = undefined;
    localStorage.removeItem("authUser");
    return of(true);
   }
}
