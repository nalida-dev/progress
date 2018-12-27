import { Component, OnInit } from '@angular/core';
import { ToDoDataService } from '../to-do-data.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-bar-progress',
  templateUrl: './bar-progress.component.html',
  styleUrls: ['./bar-progress.component.scss']
})
export class BarProgressComponent implements OnInit {

  data: any = null;

  constructor(
    private route: ActivatedRoute,
    private toDoDataService: ToDoDataService) { }

  ngOnInit() {
    this.fetchData();
    console.log(moment());
  }

  fetchData() {
    const sheet_id = this.route.snapshot.paramMap.get('sheet_id');
    const sheet_name = this.route.snapshot.paramMap.get('sheet_name');
    const api_key = this.route.snapshot.paramMap.get('api_key');
    this.toDoDataService.fetchToDoData(sheet_id, sheet_name, api_key)
      .subscribe(data => {
        console.log(data);
        this.data = data;
      });
    }

}
