import RTCManager from "./rtc_manager";
import Package from "@/../../package.json";

class Capabilities {

    static MIN_DOWNLOAD_SPEED = Package.is_atc ? 0.128 : 0.5;
    static MIN_UPLOAD_SPEED = Package.is_atc ? 0.128 : 0.5;
    static SPEED_CHECK_TIMEOUT = 100;
    static RTC_CHECK_TIMEOUT = 5000;

    static _rtcCheckRef = null;
    static _rtcWaitCount = 0;

    static performSpeedTest(maxTime = Capabilities.SPEED_CHECK_TIMEOUT) {

        return new Promise((resolve, reject) => {

            let testFinished = false;

            const speedTest = window.require('speedtest-net');
            const currentSpeedTest = speedTest({maxTime});

            currentSpeedTest.on('data', (data) => {

                if(!testFinished) {
                    
                    if (data.speeds.download > Capabilities.MIN_DOWNLOAD_SPEED && 
                        data.speeds.upload > Capabilities.MIN_UPLOAD_SPEED) {
                        resolve();
                    }
                    else 
                    if (data.speeds.download < Capabilities.MIN_DOWNLOAD_SPEED && 
                        data.speeds.upload < Capabilities.MIN_UPLOAD_SPEED) {
                        reject(`Insufficient download and upload speed. Download: ${Capabilities.roundSpeed(data.speeds.download)} mbps. Upload: ${Capabilities.roundSpeed(data.speeds.upload)} mbps.`);
                    }
                    else 
                    if (data.speeds.download < Capabilities.MIN_DOWNLOAD_SPEED) {
                        reject(`Insufficient download speed. Download: ${Capabilities.roundSpeed(data.speeds.download)} mbps.`);
                    }
                    else 
                    if (data.speeds.upload < Capabilities.MIN_UPLOAD_SPEED) {
                        reject(`Insufficient upload speed. Upload: ${Capabilities.roundSpeed(data.speeds.upload)} mbps.`);
                    }
                }

                testFinished = true;
            });

            currentSpeedTest.on('error', (err) => {

                if(!testFinished)
                    reject('Test failed. Your connection speed might affect your experience.');
                
                testFinished = true;
            });
        });
    }

    static roundSpeed(value, multiplier = 10) {
        return parseInt(value * multiplier) / multiplier
    }

    static performRtcCheck() {

        if(Capabilities._rtcCheckRef !== null)
            clearInterval(Capabilities._rtcCheckRef);

        return new Promise((resolve, reject) => {

            Capabilities._rtcCheckRef = setInterval(() => {

                if(RTCManager.isConnected()) {

                    clearInterval(Capabilities._rtcCheckRef);
                    Capabilities._rtcCheckRef = null;

                    resolve();
                }
                else if(Capabilities._rtcWaitCount >= Capabilities.RTC_CHECK_TIMEOUT) {

                    clearInterval(Capabilities._rtcCheckRef);
                    Capabilities._rtcCheckRef = null;

                    reject();
                }

                Capabilities._rtcWaitCount++ ;
            }, 
            1000);
        });
    }
}

export default Capabilities;