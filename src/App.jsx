import './App.css';
import { useEffect, useState } from 'react';
import { format, subMonths } from 'date-fns';
import { BoxplotWeather } from './components/BoxplotWeather';
import { LineChartWeather } from './components/LineChartWeather';
import { fetchWeatherData } from './repo/openMeteo'


function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const start = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
      const end = format(new Date(), 'yyyy-MM-dd');
      const lat = -23.55;
      const lon = -46.63;

      const weather = await fetchWeatherData(lat, lon, start, end);
      setData(weather);
    };

    fetchData();
  }, []);

  if (!data) return <div className="p-4">Carregando dados...</div>;

  return (
    <main className="p-4 space-y-12">
      <h1 className="text-2xl font-bold">Clima - São Paulo (Últimos 3 meses)</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Gráfico de Linhas</h2>
        <LineChartWeather data={data} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Boxplot Mensal por Variável</h2>
        <BoxplotWeather data={data} />
      </section>
    </main>
  );
}

export default App;
