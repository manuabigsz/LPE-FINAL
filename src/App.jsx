import { useEffect, useState } from 'react';
import { format, subMonths } from 'date-fns';
import { BoxplotWeather } from './components/BoxplotWeather';
import { LineChartWeather } from './components/LineChartWeather';
import { fetchWeatherData } from './repo/openMeteo';

// Importando componentes do React-Bootstrap
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup,
} from 'react-bootstrap';

// Importando ícones
import {
  FaSearch,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaCloudShowersHeavy,
  FaChartLine,
  FaBoxOpen,
  FaExclamationTriangle,
  FaCity,
} from 'react-icons/fa';

// Estilos inline para customização do tema dark
const styles = {
  body: {
    backgroundColor: '#1a1a2e', // Fundo azul escuro profundo
    color: '#e0e0e0',
    minHeight: '100vh',
  },
  card: {
    backgroundColor: '#242a42', // Cor do card um pouco mais clara
    border: '1px solid #4f5b82',
    borderRadius: '15px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)', // Efeito de vidro (opcional)
  },
  cardHeader: {
    backgroundColor: 'transparent',
    borderBottom: '1px solid #4f5b82',
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  accentColor: '#00aaff',
};

function App() {
  const [city, setCity] = useState('Lisboa');
  const [data, setData] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Funções de busca de dados (permanecem as mesmas)
  const fetchCoordinates = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const res = await fetch(url);
    const results = await res.json();
    return results.length > 0 ? results[0] : null;
  };

  const loadData = async (place) => {
    setLoading(true);
    setError('');
    const location = await fetchCoordinates(place);
    if (!location) {
      setError('Cidade não encontrada. Tente um nome diferente ou mais específico.');
      setLoading(false);
      setData(null);
      setLocationInfo(null);
      return;
    }
    setLocationInfo(location);
    const start = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
    const end = format(new Date(), 'yyyy-MM-dd');
    const weather = await fetchWeatherData(parseFloat(location.lat), parseFloat(location.lon), start, end);
    setData(weather);
    setLoading(false);
  };

  useEffect(() => {
    document.body.style.backgroundColor = styles.body.backgroundColor;
    loadData(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) loadData(city);
  };

  return (
    <div style={styles.body}>
      <Container fluid="lg" className="py-4 py-md-5">
        <header className="mb-5 text-center">
          <h1 className="display-4 fw-bold text-white">
            Clima <span style={{ color: styles.accentColor }}>Vision</span>
          </h1>
          <p className="lead text-white-50">Sua janela para o clima em qualquer lugar do mundo.</p>
        </header>

        <Row className="justify-content-center mb-4">
          <Col md={8} lg={6}>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <InputGroup.Text style={{ ...styles.card, borderRight: 0 }}>
                  <FaCity color={styles.accentColor} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Buscar por cidade..."
                  required
                  style={{ ...styles.card, borderLeft: 0, color: '#fff' }}
                  className="shadow-none"
                />
                <Button variant="primary" type="submit" disabled={loading} style={{ backgroundColor: styles.accentColor, borderColor: styles.accentColor }}>
                  {loading ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <FaSearch />
                  )}
                  <span className="ms-2 d-none d-md-inline">{loading ? 'Buscando...' : 'Buscar'}</span>
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="d-flex align-items-center" style={{ backgroundColor: '#581c1c', borderColor: '#e11d48', color: '#fecaca' }}>
            <FaExclamationTriangle className="me-3" size={24} />
            {error}
          </Alert>
        )}

        {loading && !data && (
          <div className="text-center p-5">
            <Spinner animation="grow" style={{ width: '3rem', height: '3rem', color: styles.accentColor }} />
            <p className="mt-3 fs-5 text-white-50">Carregando dados meteorológicos...</p>
          </div>
        )}

        {data && locationInfo && (
          <>
            <Card className="mb-4" style={styles.card}>
              <Card.Header style={styles.cardHeader}>
                <FaMapMarkerAlt className="me-2" style={{ color: styles.accentColor }} />
                Localização Atual
              </Card.Header>
              <Card.Body>
                <h2 className="h4" style={{ color: styles.accentColor }}>{locationInfo.name}</h2>
                <p className="mb-1 text-white-50">{locationInfo.display_name}</p>
                <Row className="mt-3">
                  <Col className='text-white-50' md={6}><strong>Latitude:</strong> {locationInfo.lat}</Col>
                  <Col className='text-white-50' md={6}><strong>Longitude:</strong> {locationInfo.lon}</Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              <Col lg={12} className="mb-4">
                <Card style={styles.card}>
                  <Card.Header style={styles.cardHeader}>
                    <FaChartLine className="me-2" style={{ color: styles.accentColor }} />
                    Gráfico de Linhas: Temperatura e Precipitação
                  </Card.Header>
                  <Card.Body>
                    <LineChartWeather data={data} accentColor={styles.accentColor} />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12}>
                <Card style={styles.card}>
                  <Card.Header style={styles.cardHeader}>
                    <FaBoxOpen className="me-2" style={{ color: styles.accentColor }} />
                    Boxplot: Distribuição Mensal dos Dados
                  </Card.Header>
                  <Card.Body>
                    <BoxplotWeather data={data} accentColor={styles.accentColor} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

export default App;