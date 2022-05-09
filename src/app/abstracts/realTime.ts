import { environment } from "../../environments/environment";
import { OnDestroy } from "@angular/core";
import { PropertiesService } from "@alis/ng-services";

export class RealTime implements OnDestroy {

    timeToRefreshRealTimeDevices;
    lastTimeRefreshed;
    interval;

    constructor(timeToRefreshRealTimeDevices:number = environment.timeToRefreshRealTimeDevices) {
            this.timeToRefreshRealTimeDevices = timeToRefreshRealTimeDevices;        
    }

    startGettingRealTimeData(getDataCallBack) {
        getDataCallBack();
        let that = this;
        this.interval = setInterval(() => {
            that.lastTimeRefreshed = new Date().getTime();
            getDataCallBack();
        }, this.timeToRefreshRealTimeDevices);
    }

    ngOnDestroy() {
       this.clearInterval();
    }

    clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    getDeviceName(devicesFromConfig, device) {
        let name;
        devicesFromConfig.forEach(configDevice => {
            if (configDevice.id === device.deviceId) {
                name = configDevice.name;
                return;
            }
        });

        if (!name) {
            //could not found, use id
            let name = device.deviceId;
        }

        return name;
    }

    getDeviceConfig(devicesFromConfig, device) {
        let ret;
        devicesFromConfig.forEach(configDevice => {
            if (configDevice.id === device.deviceId) {
                ret = configDevice;
                return;
            }
        });

        return ret;
    }


    logNotConfigFound(deviceId, ownerId) {
        console.warn("A device '" + deviceId.deviceId + "' was found in propertyId '" + ownerId + "' " +
            "but could not be found a deviceConfig for this device in appConfig file...lets skip it");
    }


}