import { NPSCategorDataChartDTO } from "./nps-by-category-data-chart.dto";
import { NPSDataDetailChartDTO } from "./nps-data-detail-chart.dto";

export class NPSCategoryDTO {
  categoriesFilter: string[];
  dataChart: NPSCategorDataChartDTO[];
  details: NPSDataDetailChartDTO[];
}
