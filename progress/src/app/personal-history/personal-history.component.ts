import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../task';
import { ToDoDataService } from '../to-do-data.service';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { getWeekByMoment, getWeekBySpecifier, Week, weekCompare } from '../dateutil';
import { nameToColor } from '../utils';

@Component({
  selector: 'app-personal-history',
  templateUrl: './personal-history.component.html',
  styleUrls: ['./personal-history.component.scss']
})
export class PersonalHistoryComponent implements OnInit {
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
        this.tasks = data;
        this.makeMemberOptions();
        this.render();
      });
  }

  makeMemberOptions() {
    const { allMembers } = this.fixMembers(this.tasks);
    const selectPerson = d3.select('#personal-history-select-person');
    const options = selectPerson.selectAll('option').data(allMembers);
    options.enter().append('option')
      .text(member => member);
    selectPerson.on('change', () => this.render());
  }

  render(_this = this) {
    const selectPerson = d3.select('#personal-history-select-person');
    const person = selectPerson.property('value');
    const data = _this.transformData(
      this.tasks.filter(task => task.members.includes(person)
        && task.completion_rate === 100)
    );
    _this.drawChart(data);
  }

  transformData(tasks: Task[]) {
    const allProjects = [...Array.from(new Set(tasks.map(task => task.project)))];
    const weeks = this.getAllWeeks(tasks);
    const weekToTimes = weeks.reduce((_weekToTimes: any, week: Week) => {
      _weekToTimes[week.weekSpecifier] = allProjects.reduce((times: any, project: string) => {
        times[project] = 0;
        return times;
      }, {});
      return _weekToTimes;
    }, {});
    tasks
      .filter(task => task.completed_date.isBetween(weeks[0].lastSaturday, weeks[weeks.length - 1].thisFriday, 'day', '[]'))
      .forEach(({completed_date, project, members, workload}) => {
        const { weekSpecifier } = getWeekByMoment(completed_date);
        weekToTimes[weekSpecifier][project] += workload / members.length;
      });
    return { weekToTimes, weeks, allProjects };
  }

  getAllWeeks(tasks: Task[]): Week[] {
    let week = getWeekByMoment();
    const allWeeks = [];
    for (let i = 0; i < 15; i++) {
      allWeeks.push(week);
      week = getWeekByMoment(week.thisFriday.clone().subtract(7, 'day'));
    }
    return allWeeks.reverse();

    /*
    const allWeeks = tasks.map(task => getWeekByMoment(task.completed_date)).sort(weekCompare);
    const [minWeek, maxWeek] = [allWeeks[0], allWeeks[allWeeks.length - 1]];
    for(let week = minWeek; week.weekSpecifier !== maxWeek.weekSpecifier;
      week = getWeekByMoment(week.thisFriday.add(7, 'day'))) {
      allWeeks.push(week);
    }
    return [...Array.from(new Set(allWeeks.sort(weekCompare).map(week => week.weekSpecifier)))]
      .map(weekSpecifier => getWeekBySpecifier(weekSpecifier));
    */
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

  drawChart({ weekToTimes, weeks, allProjects }:
    { weekToTimes: any, weeks: Week[], allProjects: string[] }) {
    const chartSpec: Highcharts.Options = {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Personal History'
      },
      xAxis: {
          categories: weeks.map(week => week.weekSpecifier)
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
    allProjects.forEach(project => {
      chartSpec.series.push({
        type: 'column',
        name: project,
        data: weeks.map(week => weekToTimes[week.weekSpecifier][project]),
        color: nameToColor(project),
      });
    });
    Highcharts.chart('personal-history-barchart', chartSpec);
  }

}
