'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export const LineChartWeather = ({ data }) => (
    <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#FF0000" name="Temperatura (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#0000FF" name="Umidade (%)" />
            <Line type="monotone" dataKey="precipitation" stroke="#00C49F" name="Precipitação (mm)" />
        </LineChart>
    </ResponsiveContainer>
);
