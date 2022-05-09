import { Historical } from "./historical";

export abstract class AbstractHistorical implements Historical {

    // chart configs
    options;
    data;

    // dates
    startDate;
    endDate;
    resolution;

    abstract getXAxis(date);
    abstract getData();

    constructor(){
        this.resolution = 'day';
    }



}
