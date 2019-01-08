import { Component, OnInit } from '@angular/core';
import { ToDoDataService } from '../to-do-data.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as Highcharts from 'highcharts';
import { Task } from '../task';
import { ArgumentOutOfRangeError } from 'rxjs';

@Component({
  selector: 'app-bar-progress',
  templateUrl: './bar-progress.component.html',
  styleUrls: ['./bar-progress.component.scss']
})
export class BarProgressComponent implements OnInit {

  tasks: Task[] = null;
  allMembers: string[];
  aggr: {[key: string]: number};

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
        this.tasks = data;
        this.fixMembers();
        this.transformData();
        this.drawChart();
      });
  }

  fixMembers() {
    this.allMembers = this.tasks.reduce((accum: string[], task) => {
      if (task.members[0] === '__ALL__') {
        return accum;
      } else {
        return [...accum, ...task.members];
      }
    }, []);
    this.allMembers = [...Array.from(new Set(this.allMembers))];
    this.tasks.forEach(task => {
      if (task.members[0] === '__ALL__') {
        task.members = this.allMembers;
      }
    });
    console.log({fixed: this.tasks});
  }

  transformData() {
    this.aggr = this.allMembers.reduce((accum, member) => {
      accum[member] = 0;
      return accum;
    }, {});
    this.tasks.filter(task => task.completion_rate === 100).forEach(task => {
      task.members.forEach(member => {
        this.aggr[member] += task.workload;
      });
    });
    console.log({aggr: this.aggr});
  }

  drawChart() {
    const chartSpec: Highcharts.Options = {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Total fruit consumtion, grouped by gender'
      },
      xAxis: {
          categories: this.allMembers,
      },
      yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
              text: 'Number of fruits'
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.x + '</b><br/>' +
                  this.series.name + ': ' + this.y + '<br/>' +
                  'Total: ' + (this.point as any).stackTotal;
          }
      },
      plotOptions: {
          column: {
              stacking: 'normal'
          }
      },
      series: []
    };
    Object.entries(this.aggr).forEach(([name, workhour], ind) => {
      chartSpec.series.push({
        type: 'column',
        name: name,
        data: [...Array.from('0'.repeat(ind)).map(d => +d), workhour],
        // stack: 'male',
        // color: 'red',
      });
    });
    Highcharts.chart('bar-progress-barchart', chartSpec);
  }

}
