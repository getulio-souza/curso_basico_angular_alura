import { DateService } from './../services/date/date.service';
import { AbstractHistorical } from './abstractHistorical';;

export abstract class AbstractThirtyDays extends AbstractHistorical {

    // historical to go one step back
    lastResolution;


    monthNames = ['January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'];


    constructor(public dateService: DateService) {
        super();
        this.startDate = dateService.getBeginCurrentMonth();
        this.endDate = dateService.getCurrentTime();
    }

    goDeeper(info: Object) {
        if (this.resolution === 'month') {
            let timestamp = info['timestamp'];

            this.resolution = 'day';
            this.lastResolution = 'month';

            this.startDate = this.dateService.getBeginOfPassedMonth(timestamp);
            this.endDate = this.dateService.getEndOfPassedMonth(timestamp);
            this.getData();

        } else if (this.resolution === 'day') {
            let timestamp = info['timestamp'];
            
            this.resolution = 'hour';
            this.lastResolution = 'day';

            this.startDate = this.dateService.getBeginOfPassedDay(timestamp);
            this.endDate = this.dateService.getEndOfPassedDay(timestamp);
            this.getData();
        }

    }

    onNavigationDateChange(datesInfo: Object) {
        this.resolution = datesInfo['resolution'];
        this.startDate = datesInfo['startDate'];
        this.endDate = datesInfo['endDate'];
        this.getData();
    }


    getXAxis(date: Date) {
        if (this.resolution === 'day') {
            return this.dateService.getDay(date.getTime());
        } else if (this.resolution === 'hour') {
            return this.dateService.getHour(date.getTime());
        } else if (this.resolution === 'month') {
            return this.dateService.getMonth(date.getTime());
        }
    }

    getXAxisLabel(value) {
        if (this.resolution === 'month') {
            // - month should be an integer between 1-12.
            // - array index should be 0-11;
            // - strategy:
            //   - we will consider 1.5 to be January and 0.5 to be December
            //   - we will wrap around any number to fall into the 0-11 range, so that:
            //     - 1-12 will translate to 0-11 (january-december)
            //     - 0, -12, 12, 24 will translate to 11 (december)
            //     - -1, -13, 11, 23 will translate to 10 (november)
            let index = (Math.floor(value%12)+11) % 12;
            const monthName = this.monthNames[index];
            return monthName != null ? monthName.toString() : value;
            
        } else if (this.resolution === 'day') {
            return (value).toString();
        } else {
            return value.toString();
        }
    }
    getAxisLabel() {
        if (this.resolution === 'month') {
            // year view
            return 'Month';
        } else if (this.resolution === 'day') {
            // month view
            return 'Day';
        } else if (this.resolution === 'hour') {
            // day view
            return 'Hour';
        }
    }
}
