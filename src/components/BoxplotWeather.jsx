'use client';

import Plot from 'react-plotly.js';
import { parseISO, format, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BoxplotWeather = ({ data, accentColor = '#00aaff' }) => {
    const variables = [
        { key: 'temperature', label: 'Temperatura', unit: '°C' },
        { key: 'humidity', label: 'Umidade', unit: '%' },
        { key: 'precipitation', label: 'Precipitação', unit: 'mm' },
        { key: 'radiation', label: 'Radiação Solar', unit: 'W/m²' },
    ];

    const darkLayoutTemplate = {
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: {
            color: '#e0e0e0',
            family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        xaxis: {
            gridcolor: '#4f5b82',
            zerolinecolor: '#6c757d',
            tickfont: { color: '#e0e0e0' },
            linecolor: '#4f5b82',
        },
        yaxis: {
            gridcolor: '#4f5b82',
            zerolinecolor: '#6c757d',
            tickfont: { color: '#e0e0e0' },
            linecolor: '#4f5b82',
        },
        showlegend: false,
    };

    return (
        <div>
            {variables.map(({ key, label, unit }) => {
                const grouped = data.reduce((acc, entry) => {
                    const date = parseISO(entry.date);
                    const monthKey = format(date, 'yyyy-MM');
                    if (!acc[monthKey]) {
                        acc[monthKey] = [];
                    }
                    acc[monthKey].push(entry[key]);
                    return acc;
                }, {});

                const sortedMonths = Object.keys(grouped).sort();

                const traces = sortedMonths.map((month) => {
                    const date = parseISO(`${month}-01`);
                    const monthName = format(date, 'MMM/yy', { locale: ptBR });

                    return {
                        y: grouped[month],
                        name: monthName,
                        type: 'box',
                        marker: {
                            color: accentColor,
                            opacity: 0.8,
                        },
                        line: {
                            color: accentColor,
                        },
                        boxpoints: 'all',
                        jitter: 0.3,
                        pointpos: -1.8,
                        hoverinfo: 'y+name',
                        marker: {
                            size: 4,
                            color: 'rgba(255, 255, 255, 0.4)',
                        },
                    };
                });

                const finalLayout = {
                    ...darkLayoutTemplate,
                    yaxis: {
                        ...darkLayoutTemplate.yaxis,
                        title: {
                            text: `${label} (${unit})`,
                            font: { size: 14 },
                        },
                    },
                };

                return (
                    <div key={key} className="mb-5">
                        <div style={{ minHeight: '400px' }}>
                            <Plot
                                data={traces}
                                layout={finalLayout}
                                config={{ responsive: true, displayModeBar: false }}
                                style={{ width: '100%', height: '100%' }}
                                use_resize_handler={true}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};