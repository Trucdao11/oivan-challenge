import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HouseServicesService {

  urlBase = 'https://vn-fe-test-api.iwalabs.info';
  constructor(private http: HttpClient, private authService: AuthService) { }

  getHouseList(): Observable<any> {
    return this.http.get<any[]>(this.urlBase + '/houses')
  }

  getHouseModelList(): Observable<any> {
    return this.http.get<any[]>(this.urlBase + '/house_models')
  }

  createHouse(data : any):Observable<any>{
    let payload = {
      data : data
    }
    return this.http.post(this.urlBase + '/houses', payload, this.authService.getAuthHeader())
  }

  updateHouse(data : any):Observable<any>{
    delete data.links;
    let payload = {
      data : data
    }
    return this.http.patch(this.urlBase + '/houses/' + data.id, payload, this.authService.getAuthHeader())
  }
}
