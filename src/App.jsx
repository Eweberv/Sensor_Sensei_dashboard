import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './App.css';
import data from './apiResponse.js';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LastData from "./LastData.jsx";
import MyHeader from "./header.jsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const optionsTemperature = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Temperature',
        },
    },
    // scales: {
    //     y: {
    //         min: -10,
    //         max: 50,
    //     },
    // },
};

export const optionsHumidity = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Humidity',
        },
    },
    // scales: {
    //     y: {
    //         min: 0,
    //         max: 100,
    //     },
    // },
};

export const optionsPressure = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Pressure',
        },
    },
};

export const optionsBattery = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
    // scales: {
    //     y: {
    //         min: 0,
    //         max: 100,
    //     },
    // },
};

const App = () => {
    const [batteryData, setBatteryData] = useState([]);
    const [batteryLabel, setBatteryLabel] = useState([]);

    const [temperatureData, setTemperatureData] = useState([]);
    const [temperatureLabels, setTemperatureLabels] = useState([]);

    const [humidityData, setHumidityData] = useState([]);
    const [humidityLabels, setHumidityLabels] = useState([]);

    const [pressureData, setPressureData] = useState([]);
    const [pressureLabels, setPressureLabels] = useState([]);

    useEffect(() => {
        const {
            humidityData: defaultHumidityData,
            humidityLabels: defaultHumidityLabels,
            temperatureData: defaultTemperatureData,
            temperatureLabels: defaultTemperatureLabels,
            pressureData: defaultPressureData,
            pressureLabels: defaultPressureLabels,
            batteryData: defaultBatteryData,
            batteryLabel: defaultBatteryLabel,
        } = getDefaultData();

        setTemperatureData(defaultTemperatureData);
        setTemperatureLabels(defaultTemperatureLabels);

        setHumidityData(defaultHumidityData);
        setHumidityLabels(defaultHumidityLabels);

        setPressureData(defaultPressureData);
        setPressureLabels(defaultPressureLabels);

        setBatteryData(defaultBatteryData);
        setBatteryLabel(defaultBatteryLabel);
    }, []);

    const getDefaultData = () => {
        const extractData = (type) => {
            const rawData = data.reduce((acc, data) => {
                if (data.SK.startsWith(type)) {
                    const [_, timestamp] = data.SK.split("#");
                    acc.data.push({value: data.VALUE, timestamp: new Date(timestamp)});
                }
                return acc;
            }, {data: []});

            //sort dates in ascending order
            rawData.data.sort((a, b) => a.timestamp - b.timestamp);

            //keep only last 24 values
            const slicedData = rawData.data.slice(0, 24);

            return {
                data: slicedData.map(d => d.value),
                labels: slicedData.map(d => d.timestamp.toLocaleTimeString())
            };
        }

        const humidity = extractData('HUMIDITY');
        const temperature = extractData('TEMPERATURE');
        const pressure = extractData('PRESSURE');
        const battery = extractData('BATTERY');

        return {
            humidityData: humidity.data,
            humidityLabels: humidity.labels,
            temperatureData: temperature.data,
            temperatureLabels: temperature.labels,
            pressureData: pressure.data,
            pressureLabels: pressure.labels,
            batteryData: battery.data,
            batteryLabel: battery.labels,
        };
    };

    const refreshData = async () => {
        try {
            const response = await fetch('https://787mb4n9fa.execute-api.eu-west-1.amazonaws.com/production/data?sensor_id=81018');
            const data = await response.json();

            const extractData = (type) => {
                const rawData = data.reduce((acc, data) => {
                    if (data.SK.startsWith(type)) {
                        const [_, timestamp] = data.SK.split("#");
                        acc.data.push({value: data.VALUE, timestamp: new Date(timestamp)});
                    }
                    return acc;
                }, {data: []});

                // Sort dates in ascending order
                rawData.data.sort((a, b) => a.timestamp - b.timestamp);

                // Keep only last 24 values
                rawData.data = rawData.data.slice(-24);

                return {
                    data: rawData.data.map(d => d.value),
                    labels: rawData.data.map(d => d.timestamp.toLocaleTimeString())
                };
            }

            const humidity = extractData('HUMIDITY');
            const temperature = extractData('TEMPERATURE');
            const pressure = extractData('PRESSURE');
            const battery = extractData('BATTERY');

            setTemperatureData(temperature.data);
            setTemperatureLabels(temperature.labels);

            setHumidityData(humidity.data);
            setHumidityLabels(humidity.labels);

            setPressureData(pressure.data);
            setPressureLabels(pressure.labels);

            setBatteryData(battery.data);
            setBatteryLabel(battery.labels);
        } catch (error) {
            console.log('Error fetching data from API:', error);
        }
    };

    const temperatureChart = {
        labels: temperatureLabels,
        datasets: [
            {
                label: '°C',
                data: temperatureData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const humidityChart = {
        labels: humidityLabels,
        datasets: [
            {
                label: '%',
                data: humidityData,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    const pressureChart = {
        labels: pressureLabels,
        datasets: [
            {
                label: 'Pa',
                data: pressureData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return (
        <div className="appContainer" style={{marginTop: '10px'}}>
            <LastData
                batteryData={batteryData}
                temperatureData={temperatureData}
                humidityData={humidityData}
                pressureData={pressureData}
                temperatureLabels={temperatureLabels}
            />
            <div className="cardContainer" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                <Card style={{ borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: "white", width: '33%' }}>
                    <Card.Body>
                        <Line className={'graphLine'} options={optionsTemperature} data={temperatureChart} />
                    </Card.Body>
                </Card>
                <Card style={{ borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: "white", width: '33%' }}>
                    <Card.Body>
                        <Line className={'graphLine'} options={optionsHumidity} data={humidityChart} />
                    </Card.Body>
                </Card>
                <Card style={{ borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: "white", width: '33%' }}>
                    <Card.Body>
                        <Line className={'graphLine'} options={optionsPressure} data={pressureChart} />
                    </Card.Body>
                </Card>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button type="button" className="refreshBtn btn btn-primary" onClick={refreshData}>Refresh</button>
            </div>
        </div>
    );
}

export default App;
