import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SodaService {

  constructor(private http: HttpClient) {}

  public insertAmount(coin: any, amount: number) : Observable<any> {
    return this.http.get('https://sodamachine-api.herokuapp.com/insertAmount/' + coin + '/' + amount).pipe();
  }

  public returnChange() {
    return this.http.get('https://sodamachine-api.herokuapp.com/returnChange/').pipe();
  }

  public dispenseSoda(sodaType: number) {
    return this.http.get('https://sodamachine-api.herokuapp.com/dispenseSoda/' + sodaType).pipe();
  }

  public getAvail() {
    return this.http.get('https://sodamachine-api.herokuapp.com/getAvailability').pipe();
  }
}
