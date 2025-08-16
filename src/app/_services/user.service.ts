import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { UserModal } from '../_model/user.modal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // PATH_OF_API = "http://127.0.0.1:62810";
  private readonly server:string=environment.API_BASE_URL;

  requestHeader = new HttpHeaders(
    { "No-Auth": "True" })
  constructor(private httpclient: HttpClient,
    private userAuthService: UserAuthService) { }

  public login(loginData:UserModal) {
    return this.httpclient.post<UserModal>(`${this.server}` + "/authenticate",
      loginData, { headers: this.requestHeader });
  }

  public forUser() {
    return this.httpclient.get(`${this.server}` + '/forUser',{
      responseType:'text'
    });
  }

  public forAdmin() {
    return this.httpclient.get(`${this.server}` + '/forAdmin',{
      responseType:'text'
    });
  }
  public roleMatch(allowedRoles: string | any[]): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();
    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          } else {
            return isMatch;
          }
        }
      }
    }
    return isMatch;
  }
  public register(registerData: any){
    return this.httpclient.post(`${this.server}`+'/registerNewUser',registerData);
  }
}