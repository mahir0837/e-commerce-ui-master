import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  
  constructor() { }
  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
  public getRoles(): string[] {
    const rolesJSON = localStorage.getItem('roles');
    if (rolesJSON) {
      return JSON.parse(rolesJSON);
    } else {
      return []; // Return an empty array as a default value if 'roles' is not found in localStorage
    }
  }
  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken)
  }
  public getToken(): string {
    const result = localStorage.getItem('jwtToken');
    if (result) {
      return result;
    } else {
      return '';
    }
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  public isAdmin() {
    const roles: any[] = this.getRoles();
    return (roles[0].roleName==='Admin'); 
  }

  public isUser(){
    const roles: any[] = this.getRoles();
    return (roles[0].roleName==='User') 
  }
}
