import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  private baseUrl = 'http://localhost:3001'; // match your backend port

  constructor(private http: HttpClient) {}

  analyze(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/analyze`, data);
  }
}

