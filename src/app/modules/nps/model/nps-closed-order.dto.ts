import { NPSDataDetailChartDTO } from "./nps-data-detail-chart.dto";

export class NPSClosedOrderDTO {
  categoriesFilter: string[];
  dataChart: number[];
  details: NPSDataDetailChartDTO[]
}
