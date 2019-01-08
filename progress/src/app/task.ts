import * as moment from 'moment';

export class Task {
  static task_id_cnt = 0;

  id: number;
  content: string;
  duedate: moment.Moment;
  members: string[];
  project: string;
  workload: number;
  completion_rate: number;
  completed_date: moment.Moment;

  constructor(content, duedate, members, project, workload, completed='', completed_date='') {
    this.id = Task.task_id_cnt++;
    this.content = (d => {
      return d === '' ? '내용 없음' : d;
    })(content);
    this.duedate = (d => {
      return d.split('.').length === 3 ?
        moment(d, 'YYYY.MM.DD').add(12, 'hours') :
        moment().add(21, 'days');
    })(duedate);
    this.members = ((d: string) => {
      return ['', '모두', '전원', '전부'].includes(d) ?
        ['__ALL__'] :
        d.split(',').map(s => s.trim());
    })(members);
    this.project = project;
    this.workload = (d => {
      return d === '' ? 0.5 : parseFloat(d);
    })(workload);
    this.completion_rate = (d => {
      const d_int = parseInt(d, 10);
      if(!isNaN(d_int)) {
        return Math.min(Math.max(d_int, 0), 100);
      }
      if(d.length > 0) {
        return 100;
      }
      return 0;
    })(completed);
    this.completed_date = (d => {
      return d.split('.').length === 3 ?
        moment(d, 'YYYY.MM.DD hh:mm aa') :
        moment().add(21, 'days');
    })(completed_date);
  }
}
