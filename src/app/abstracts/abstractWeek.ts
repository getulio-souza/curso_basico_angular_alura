import { PeriodEnum } from './../services/data/data.service';
import { environment } from './../../environments/environment';
import { AbstractHistorical } from './abstractHistorical';
import { DateService } from './../services/date/date.service';

export abstract class AbstractWeek extends AbstractHistorical {

    weekDayNames = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    period = PeriodEnum.DAY_OF_WEEK;

    periodEntries;
    numberOfWeeks;

    constructor(dateService: DateService) {
        super();
        this.numberOfWeeks = environment.numberOfWeeks;
        this.startDate = dateService.getWeeksBefore(this.numberOfWeeks);
        this.endDate = dateService.getCurrentTime();
    }

    goDeeper(info: Object) {

        if (this.resolution === 'day') {
            this.resolution = 'hour';
            this.periodEntries = info['key'];
            this.getData();
        }
        return ;
    }


    getXAxis(axisFromElastic) {
        if(axisFromElastic < 0) {
            return ;
        }
        if (this.resolution === 'day') {
            return this.weekDayNames[axisFromElastic];
        } else if (this.resolution === 'hour') {
            return axisFromElastic;
        }
    }

    getWeekDayName() {
        if (this.resolution === 'hour') {
            return this.weekDayNames[this.periodEntries];
        }
    }

    oneStepBack() {
        if (this.resolution === 'hour') {
            this.resolution = 'day';
            this.periodEntries = null;
            this.getData();
        }

    }

}
