import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DemotableService {
  baseURL: string = "http://localhost:8080/";
  constructor(private http: HttpClient) { }
  addPerson(person:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(person);
    console.log(body)
    return this.http.post(this.baseURL + 'add', body,{'headers':headers})
  }
  getPerson(): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    return this.http.get(this.baseURL + 'get',{'headers':headers})
  }
}
