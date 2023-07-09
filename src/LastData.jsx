import React from "react";
import { Card } from 'react-bootstrap';
import './latestData.css';

const LastData = (props) => {
    const { batteryData, temperatureData, humidityData, pressureData, temperatureLabels } = props;

    const latestTimestamp = temperatureLabels && temperatureLabels.length > 0 ? temperatureLabels[temperatureLabels.length - 1] : null;
    const latestBatteryData = batteryData[batteryData.length - 1];


    let batteryClass;
    if (latestBatteryData <= 25) {
        batteryClass = 'text-danger';
    } else if (latestBatteryData <= 50) {
        batteryClass = 'text-warning';
    } else {
        batteryClass = 'text-success';
    }

    return (
        <div className="card mt-3">
            <div className="card-header">
                Latest payload - Sensor 88042
                <div className="text-muted small mt-1">
                    {latestTimestamp ? `Updated: ${latestTimestamp}` : 'Timestamp not available'}
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <div className={`h5 ${batteryClass}`}>
                            {`${latestBatteryData}%`}
                        </div>
                        <div>Battery</div>
                    </div>
                    <div className="col">
                        <div className="h5">{temperatureData && temperatureData.length > 0 ? `${temperatureData[temperatureData.length - 1]}°C` : 'Temperature data not available'}</div>
                        <div>Temperature</div>
                    </div>
                    <div className="col">
                        <div className="h5">{humidityData && humidityData.length > 0 ? `${humidityData[humidityData.length - 1]}%` : 'Humidity data not available'}</div>
                        <div>Humidity</div>
                    </div>
                    <div className="col">
                        <div className="h5">{pressureData && pressureData.length > 0 ? `${pressureData[pressureData.length - 1]} Pa` : 'Pressure data not available'}</div>
                        <div>Pressure</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default LastData;
