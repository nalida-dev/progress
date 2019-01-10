import { Component, OnInit } from '@angular/core';
import { ToDoDataService } from '../to-do-data.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
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

  constructor(
    private route: ActivatedRoute,
    private toDoDataService: ToDoDataService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const sheet_id = this.route.snapshot.paramMap.get('sheet_id');
    const sheet_name = this.route.snapshot.paramMap.get('sheet_name');
    const api_key = this.route.snapshot.paramMap.get('api_key');
    this.toDoDataService.fetchToDoData(sheet_id, sheet_name, api_key)
      .subscribe(data => {
        console.log(data);
        this.tasks = data;
        this.makeWeekOptions();
        this.render();
      });
  }

  render(_this = this) {
    const selectWeek = d3.select('#bar-progress-select-week');
    const week = getWeekBySpecifier(selectWeek.property('value'));
    const data = _this.transformData(week);
    _this.drawChart(data);
  }

  transformData(week: Week) {
    const { tasks, allMembers } = this.fixMembers(this.tasksOnTheWeek(week));
    const allProjects = [...Array.from(new Set(tasks.map(task => task.project)))];
    const projectToTimes = allProjects.reduce((_projectToTimes: any, project: string) => {
      _projectToTimes[project] = allMembers.reduce((times: any, member: string) => {
        times[member] = 0;
        return times;
      }, {});
      return _projectToTimes;
    }, {});
    tasks.forEach(({project, members, workload}) => {
        members.forEach(member => {
          projectToTimes[project][member] += workload;
        });
      });
    return { projectToTimes, allMembers, allProjects };
  }

  makeWeekOptions() {
    const weeks = this.getAllWeeks();
    const selectWeek = d3.select('#bar-progress-select-week');
    const options = selectWeek.selectAll('option').data(weeks);
    options.enter().append('option')
      .text(d => d);
    selectWeek.on('change', () => this.render());

  }

  getAllWeeks() {
    const allWeeks = new Set(
      this.tasks
        .filter(task => task.completion_rate === 100)
        .map(task => getWeekByMoment(task.completed_date))
        .sort((week1, week2) => {
          if (week1.lastSaturday < week2.lastSaturday) {
            return 1;
          } else if (week1.lastSaturday > week2.lastSaturday) {
            return -1;
          } else {
            return 0;
          }
        })
        .map(week => week.weekSpecifier)
      );
    return [...Array.from(allWeeks)];
  }

  tasksOnTheWeek(week: Week) {
    const { lastSaturday, thisFriday } = week;
    const filteredTasks = this.tasks.filter(task =>
      task.completion_rate === 100 &&
      task.completed_date.isBetween(lastSaturday, thisFriday, 'day', '[]'));
    console.log(filteredTasks);
    return filteredTasks;
  }

  fixMembers(tasks: Task[]) {
    let allMembers = tasks.reduce((accum: string[], task) => {
      if (task.members[0] === '__ALL__') {
        return accum;
      } else {
        return [...accum, ...task.members];
      }
    }, []);
    allMembers = [...Array.from(new Set(allMembers))].sort((name1, name2) => name1.localeCompare(name2));
    tasks.forEach(task => {
      if (task.members[0] === '__ALL__') {
        task.members = allMembers;
      }
    });
    return { tasks, allMembers };
  }

  drawChart({ projectToTimes, allMembers, allProjects }:
    { projectToTimes: any, allMembers: string[], allProjects: string[] }) {
    const chartSpec: Highcharts.Options = {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Weekly progress'
      },
      xAxis: {
          categories: allMembers,
      },
      yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
              text: 'Hour'
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
    Object.entries(projectToTimes).forEach(([project, times], ind) => {
      chartSpec.series.push({
        type: 'column',
        name: project,
        data: allMembers.map(member => times[member]),
        color: nameToColor(project),
        // stack: 'male',
      });
    });
    Highcharts.chart('bar-progress-barchart', chartSpec);
  }

}
