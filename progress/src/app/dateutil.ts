import * as moment from 'moment';

const dateFormat = 'YY/M/D';

export interface Week {
    weekSpecifier: string;
    lastSaturday: moment.Moment;
    thisFriday: moment.Moment;
}

export function getWeekByMoment(now: moment.Moment = moment()): Week {
    const lastSaturday = now.clone();
    lastSaturday.day(-1);
    const thisFriday = now.clone();
    thisFriday.day(5);
    const weekSpecifier = `${lastSaturday.format(dateFormat)} ~ ${thisFriday.format(dateFormat)}`;
    return {weekSpecifier, lastSaturday, thisFriday};
}

export function getWeekBySpecifier(specifier: string): Week {
    const [dayFrom, dayTo] = specifier.split('~').map(d => d.trim());
    return {
        weekSpecifier: specifier,
        lastSaturday: moment(dayFrom, dateFormat),
        thisFriday: moment(dayTo, dateFormat)
    };
}

export function weekCompare(week1: Week, week2: Week) {
    if (week1.lastSaturday < week2.lastSaturday) {
        return -1;
    } else if (week1.lastSaturday > week2.lastSaturday) {
        return 1;
    } else {
        return 0;
    }
}
