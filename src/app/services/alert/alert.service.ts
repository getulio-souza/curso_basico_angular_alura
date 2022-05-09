import { PropertiesService } from '@alis/ng-services';
import { Injectable } from '@angular/core';
import { FakeDataService } from './../fake-data/fake-data.service';
import { AbstractService } from '@alis/ng-services';
import { Observable, of } from 'rxjs';



export interface AlertData {
  deviceId: string;
  severity: string;
  startedAt: number,
  text: string;
}

export enum AlertSeverity {
  ALERT_CRITICAL = 'critical',
  ALERT_WARNING = 'warning',
  ALERT_ERROR = 'error'
}


@Injectable({
  providedIn: 'root'
})
export class AlertService extends AbstractService {

  private static apiPathProperty = 'alertstUrl';
  

  constructor(
    propertiesService: PropertiesService,
    private fakeDataService: FakeDataService) {

    super(AlertService.apiPathProperty, propertiesService);

  }


  getWarningSvg(severityColor: string) {

    let withNoHash = severityColor.replace("#","_");

    return  `
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.6 55.6">     
      <defs>
        <style>
          .icon-alert .a-1.a-${withNoHash} {
            fill: ${severityColor};
          }
          .icon-alert .a-2,.icon-alert .a-4 {
            fill: #1D232B;
          }
          .icon-alert .a-3, .icon-alert .a-4 {
            stroke: none;
          }

      
        </style>   
      </defs>                
       <g class="icon-alert" transform="translate(0 0)">
          <g class="a-1 a-${withNoHash}" id="Polígono_18" data-name="Polígono 18" class="a-1 a-low">
            <path class="a-3" d="M 27.84151077270508 28.50000190734863 L 5.158490180969238 28.50000190734863 C 4.257979869842529 28.50000190734863 3.450089931488037 28.0352611541748 2.997380018234253 27.25682067871094 C 2.544670104980469 26.47839164733887 2.540260076522827 25.5463809967041 2.985579967498779 24.76369094848633 L 14.3270902633667 4.830121517181396 C 14.77729988098145 4.038841247558594 15.589599609375 3.566441297531128 16.5 3.566441297531128 C 17.410400390625 3.566441297531128 18.22270011901855 4.038841247558594 18.67291069030762 4.830121517181396 L 30.01441955566406 24.76369094848633 C 30.45973968505859 25.5463809967041 30.45532989501953 26.47839164733887 30.00262069702148 27.25683212280273 C 29.5499095916748 28.0352611541748 28.74201965332031 28.50000190734863 27.84151077270508 28.50000190734863 Z"/>
            <path class="a-4" d="M 16.5 4.066431045532227 C 15.77168083190918 4.066431045532227 15.12183952331543 4.444360733032227 14.76166915893555 5.077381134033203 L 3.420160293579102 25.01096153259277 C 3.063909530639648 25.63710021972656 3.06743049621582 26.38271141052246 3.429599761962891 27.00546073913574 C 3.791770935058594 27.62821197509766 4.438089370727539 28.00000190734863 5.158489227294922 28.00000190734863 L 27.84151077270508 28.00000190734863 C 28.56192016601563 28.00000190734863 29.20822906494141 27.62821197509766 29.57040023803711 27.00546073913574 C 29.93256950378418 26.38271141052246 29.93610000610352 25.63710021972656 29.5798397064209 25.01095199584961 L 18.23833084106445 5.077390670776367 C 17.87815093994141 4.444360733032227 17.22830963134766 4.066431045532227 16.5 4.066431045532227 M 16.5 3.066436767578125 C 17.51614761352539 3.066436767578125 18.53229522705078 3.571910858154297 19.10749053955078 4.582860946655273 L 30.44899940490723 24.51643180847168 C 31.58690071105957 26.51637077331543 30.14250946044922 29.00000190734863 27.84151077270508 29.00000190734863 L 5.158489227294922 29.00000190734863 C 2.857500076293945 29.00000190734863 1.41309928894043 26.51637077331543 2.551000595092773 24.51643180847168 L 13.89250946044922 4.582860946655273 C 14.46770477294922 3.571910858154297 15.48385238647461 3.066436767578125 16.5 3.066436767578125 Z"/>
          </g>
            <path id="Icon_ionic-ios-warning" data-name="Icon ionic-ios-warning" class="a-2" d="M19.237,15.047l-.253,8.578H17.016l-.253-8.578ZM18,28.294A1.295,1.295,0,1,1,19.343,27,1.306,1.306,0,0,1,18,28.294Z" transform="translate(-1.657 -3.047)"/>
        </g>
      </svg>
    </div>`
  }

  getDefaultColor(severity) {

    if (severity == AlertSeverity.ALERT_CRITICAL) {
      return '#E84D4D'
    } else if (severity == AlertSeverity.ALERT_WARNING) {
      return '#FCB527'
    } else if (severity == AlertSeverity.ALERT_ERROR) {
      return '#0070C6'
    }

    return '#FCB527';
  }

  getAlertsByProperty(owner: string) : Observable<Array<AlertData>>{

    return of(this.fakeDataService.getAlertDataByProperty(owner));
    // return this.getApiUrl().pipe(map((apiUrl) => {
    //   let url = apiUrl + '/property';
    //   const cacheId = url;

    //   return this.contextService.getRequestObservable(cacheId, this.http.get(url));
    // }), switchAll());
  }

}