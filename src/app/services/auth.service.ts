import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  login(username:String, password:string){
    return this.http.post(this.baseUrl+'/login', {username, password}, {observe: 'response'});
  }

  selectFactor(authenticator:string, authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Auth-Token': authToken
      })
    }  
    return this.http.get(this.baseUrl+'/select-authenticator?authenticator='+authenticator, httpOptions);
  }

  answerChallenge(answer:string, authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Auth-Token': authToken
      })
    }  
    return this.http.get(this.baseUrl+'/answer-enrollment-challenge?answer='+answer, httpOptions);
  }

  register(firstName:String, lastName:string, email: string){
    return this.http.post(this.baseUrl+'/register', {firstName, lastName, email}, {observe: 'response'});
  }

  enrollFactor(authenticator:string, authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Auth-Token': authToken
      })
    }  
    return this.http.get(this.baseUrl+'/enroll-authenticator?authenticator='+authenticator, httpOptions);
  }

  recoverPassword(email:string){
    return this.http.get(this.baseUrl+'/recover-password?email='+email, {observe: 'response'});
  }

  skip(authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Auth-Token': authToken
      })
    }  
    return this.http.get(this.baseUrl+'/skip', httpOptions);
  }

  resendCode(authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Auth-Token': authToken
      })
    }  
    return this.http.get(this.baseUrl+'/resend-code', httpOptions);
  }

  enrollPhone(phoneNumber:string, authToken: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Auth-Token': authToken
      })
    }  
    return this.http.get(this.baseUrl+'/enroll-phone?phoneNumber='+phoneNumber, httpOptions);
  }

  logout(accessToken:string){
     
    return this.http.post(this.baseUrl+'/logout', {accessToken});
  }
}
