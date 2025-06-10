'use client';

import Plot from 'react-plotly.js';
import { parseISO, format } from 'date-fns';

export const BoxplotWeather = ({ data }) => {
    const variables = [
        { key: 'temperature', label: 'Temperatura (°C)' },
        { key: 'humidity', label: 'Umidade (%)' },
        { key: 'precipitation', label: 'Precipitação (mm)' },
        { key: 'radiation', label: 'Radiação Solar (W/m²)' },
    ];

    return (
        <div className="space-y-12">
            {variables.map(({ key, label }) => {
                const grouped = {};
                data.forEach((entry) => {
                    const month = format(parseISO(entry.date), 'yyyy-MM');
                    if (!grouped[month]) grouped[month] = [];
                    grouped[month].push(entry[key]);
                });

                const traces = Object.entries(grouped).map(([month, values]) => ({
                    y: values,
                    name: month,
                    type: 'box',
                }));

                return (
                    <div key={key}>
                        <h2 className="text-xl font-semibold mb-4">{label}</h2>
                        <Plot
                            data={traces}
                            layout={{
                                width: 800,
                                height: 400,
                                boxmode: 'group',
                                title: `Boxplot por mês - ${label}`,
                            }}
                            config={{ responsive: true }}
                        />
                    </div>
                );
            })}
        </div>
    );
};
