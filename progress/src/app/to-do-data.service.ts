import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class ToDoDataService {

  toDoData: any = null;

  constructor(
    private http: HttpClient) { }

  fetchToDoData(sheet_id, sheet_name, api_key) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/${sheet_name}?key=${api_key}`;
    if (this.toDoData) {
      return of(this.toDoData);
    } else {
      return this.http.get<any>(url).pipe(
        catchError(this.handleError('fetchToDoData', {})),
        tap(data => {
          this.toDoData = data;
        }),
        map(data => {
          return data.values.slice(2).map(
            (row: [any, any, any, any, any, any, any]) => {
              return new Task(...row);
            }
          );
        })
      );
    }
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
