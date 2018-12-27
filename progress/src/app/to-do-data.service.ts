import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
        tap(data => {
          this.toDoData = data;
        })
      );
    }
  }

}
