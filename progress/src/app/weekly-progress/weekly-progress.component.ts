import { Component, OnInit, Input } from '@angular/core';
import { ToDoDataService } from '../to-do-data.service';
import { Task } from '../task';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { getWeekBySpecifier, Week, getWeekByMoment } from '../dateutil';
import { nameToColor } from '../utils';

@Component({
  selector: 'app-weekly-progress',
  templateUrl: './weekly-progress.component.html',
  styleUrls: ['./weekly-progress.component.scss']
})
export class WeeklyProgressComponent implements OnInit {
  tasks: Task[];
  @Input() sheet_id: string;
  @Input() sheet_name: string;
  @Input() api_key: string;

  constructor(
    private toDoDataService: ToDoDataService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.toDoDataService.fetchToDoData(this.sheet_id, this.sheet_name, this.api_key)
      .subscribe(data => {
        console.log(data);
        this.tasks = data;
        this.makeWeekOptions();
        this.render();
      });
  }

  render(_this = this) {
    const selectWeek = d3.select('#weekly-progress-select-week');
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
          projectToTimes[project][member] += workload / members.length;
        });
      });
    return { projectToTimes, allMembers, allProjects };
  }

  makeWeekOptions() {
    const weeks = this.getAllWeeks();
    const selectWeek = d3.select('#weekly-progress-select-week');
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
    Highcharts.chart('weekly-progress-barchart', chartSpec);
  }

}
