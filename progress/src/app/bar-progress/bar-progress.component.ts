import { Component, OnInit } from '@angular/core';
import { ToDoDataService } from '../to-do-data.service';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Task } from '../task';
import { getWeekByMoment, getWeekBySpecifier, Week } from '../dateutil';
import * as d3 from 'd3';
import { nameToColor } from '../utils';

@Component({
  selector: 'app-bar-progress',
  templateUrl: './bar-progress.component.html',
  styleUrls: ['./bar-progress.component.scss']
})
export class BarProgressComponent implements OnInit {

  tasks: Task[];
  sheet_id: string;
  sheet_name: string;
  api_key: string;

  constructor(
    private route: ActivatedRoute,
    private toDoDataService: ToDoDataService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.sheet_id = this.route.snapshot.paramMap.get('sheet_id');
    this.sheet_name = this.route.snapshot.paramMap.get('sheet_name');
    this.api_key = this.route.snapshot.paramMap.get('api_key');
  }
}
