import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlBase = 'https://vn-fe-test-api.iwalabs.info';
  token ="";
  constructor(private http: HttpClient) { }

  public setToken(t: any): void {
    localStorage.setItem('token', t);
    this.token = t;
    console.log("🚀 ~ AuthService ~ setToken ~ this.token:", this.token)
  }

  

  public getAuthHeader(): any {

    if (!this.token) {
        this.token = localStorage.getItem('token') || "";
    }
    let headers = new HttpHeaders({
        'authentication':this.token ,
        'Content-Type': 'application/vnd.api+json'
        });
    headers.append("Accept", `application/json, text/plain, */*`);
    return  { headers: headers };
  }

  public login(data: any): Observable<any> {
    let payload = {
      data : {
        type: 'auth',
        attributes: data
      }
      
    }
    return this.http.post<any>(this.urlBase + '/auth', payload)
  }
}
