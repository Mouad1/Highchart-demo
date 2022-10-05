import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HighchartService {

  constructor( private http : HttpClient) { }
  public getChartDataSubject = new BehaviorSubject<any>([]);

  getData(){
   return this.http.get("https://63349034ea0de5318a05577e.mockapi.io/api/v1/xychart").pipe(res => res);
  }

  getConsoData(){
    return this.http.get('https://6335a3b7ea0de5318a17fa31.mockapi.io/api/v1/conso').pipe(
      (map((x:any)=> x[0]))
    );
  }
}
