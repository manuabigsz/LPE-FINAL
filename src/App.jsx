import { useEffect, useState } from 'react';
import { format, subMonths, subDays, subWeeks, subYears } from 'date-fns';
import { BoxplotWeather } from './components/BoxplotWeather';
import { LineChartWeather } from './components/LineChartWeather';
import { fetchWeatherData } from './repo/openMeteo';
import { fetchCoordinates } from './repo/openstreet';

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
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';

import {
  FaSearch,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaCloudShowersHeavy,
  FaChartLine,
  FaBoxOpen,
  FaExclamationTriangle,
  FaCity,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';

const styles = {
  body: {
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    minHeight: '100vh',
  },
  card: {
    backgroundColor: '#242a42',
    border: '1px solid #4f5b82',
    borderRadius: '15px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
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

const timeIntervals = [
  { label: '1 Semana', value: '1week', days: 7 },
  { label: '2 Semanas', value: '2weeks', days: 14 },
  { label: '1 Mês', value: '1month', days: 30 },
  { label: '3 Meses (Padrão)', value: '3months', days: 90 },
  { label: '6 Meses', value: '6months', days: 180 },
  { label: '1 Ano', value: '1year', days: 365 },
  { label: 'Personalizado', value: 'custom', days: null },
];

function App() {
  const [city, setCity] = useState('Lisboa');
  const [data, setData] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedInterval, setSelectedInterval] = useState('3months');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDates, setShowCustomDates] = useState(false);

  const calculateDates = (intervalValue) => {
    const endDate = new Date();
    let startDate;

    switch (intervalValue) {
      case '1week':
        startDate = subDays(endDate, 7);
        break;
      case '2weeks':
        startDate = subDays(endDate, 14);
        break;
      case '1month':
        startDate = subMonths(endDate, 1);
        break;
      case '3months':
        startDate = subMonths(endDate, 3);
        break;
      case '6months':
        startDate = subMonths(endDate, 6);
        break;
      case '1year':
        startDate = subYears(endDate, 1);
        break;
      case 'custom':
        return {
          start: customStartDate,
          end: customEndDate || format(endDate, 'yyyy-MM-dd')
        };
      default:
        startDate = subMonths(endDate, 3);
    }

    return {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd')
    };
  };

  const loadData = async (place, intervalValue = selectedInterval) => {
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

    if (intervalValue === 'custom') {
      if (!customStartDate) {
        setError('Por favor, selecione uma data de início para o período personalizado.');
        setLoading(false);
        return;
      }

      const startDateObj = new Date(customStartDate);
      const endDateObj = new Date(customEndDate || new Date());

      if (startDateObj >= endDateObj) {
        setError('A data de início deve ser anterior à data de fim.');
        setLoading(false);
        return;
      }

      const diffTime = Math.abs(endDateObj - startDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 730) {
        setError('O período selecionado não pode exceder 2 anos.');
        setLoading(false);
        return;
      }
    }

    const dates = calculateDates(intervalValue);

    try {
      const weather = await fetchWeatherData(
        parseFloat(location.lat),
        parseFloat(location.lon),
        dates.start,
        dates.end
      );
      setData(weather);
    } catch (err) {
      setError('Erro ao carregar dados meteorológicos. Tente novamente.');
      console.error('Erro ao carregar dados:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    document.body.style.backgroundColor = styles.body.backgroundColor;
    loadData(city);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) loadData(city);
  };

  const handleIntervalChange = (intervalValue) => {
    setSelectedInterval(intervalValue);
    setShowCustomDates(intervalValue === 'custom');

    if (intervalValue !== 'custom' && data) {
      loadData(city, intervalValue);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && data) {
      loadData(city, 'custom');
    }
  };

  const getCurrentIntervalLabel = () => {
    const interval = timeIntervals.find(i => i.value === selectedInterval);
    return interval ? interval.label : 'Intervalo';
  };

  const maxDate = format(new Date(), 'yyyy-MM-dd');

  const minDate = format(subYears(new Date(), 2), 'yyyy-MM-dd');

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
              <InputGroup className="mb-3">
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
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: styles.accentColor, borderColor: styles.accentColor }}
                >
                  {loading ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <FaSearch />
                  )}
                  <span className="ms-2 d-none d-md-inline">{loading ? 'Buscando...' : 'Buscar'}</span>
                </Button>
              </InputGroup>

              {/* Controles de Intervalo de Tempo */}
              <Row className="align-items-end">
                <Col md={showCustomDates ? 12 : 12}>
                  <Form.Label className="text-white-50 mb-2">
                    <FaClock className="me-2" />
                    Período de Dados
                  </Form.Label>
                  <Dropdown as={ButtonGroup} className="w-100">
                    <Button
                      variant="outline-primary"
                      style={{
                        backgroundColor: styles.card.backgroundColor,
                        borderColor: styles.accentColor,
                        color: styles.accentColor
                      }}
                      className="text-start flex-grow-1"
                    >
                      <FaCalendarAlt className="me-2" />
                      {getCurrentIntervalLabel()}
                    </Button>
                    <Dropdown.Toggle
                      split
                      variant="outline-primary"
                      style={{
                        backgroundColor: styles.card.backgroundColor,
                        borderColor: styles.accentColor,
                        color: styles.accentColor
                      }}
                    />
                    <Dropdown.Menu style={styles.card}>
                      {timeIntervals.map((interval) => (
                        <Dropdown.Item
                          key={interval.value}
                          onClick={() => handleIntervalChange(interval.value)}
                          active={selectedInterval === interval.value}
                          style={{
                            backgroundColor: selectedInterval === interval.value ? styles.accentColor : 'transparent',
                            color: selectedInterval === interval.value ? '#fff' : '#e0e0e0'
                          }}
                        >
                          {interval.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              {/* Campos de Data Personalizada */}
              {showCustomDates && (
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Label className="text-white-50 mb-1">Data de Início</Form.Label>
                    <Form.Control
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      min={minDate}
                      max={maxDate}
                      style={{ ...styles.card, color: '#fff' }}
                      className="shadow-none"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="text-white-50 mb-1">Data de Fim (opcional)</Form.Label>
                    <Form.Control
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      min={customStartDate || minDate}
                      max={maxDate}
                      style={{ ...styles.card, color: '#fff' }}
                      className="shadow-none"
                    />
                  </Col>
                  <Col xs={12} className="mt-2">
                    <Button
                      variant="outline-primary"
                      onClick={handleCustomDateSubmit}
                      disabled={!customStartDate || loading}
                      style={{
                        borderColor: styles.accentColor,
                        color: styles.accentColor
                      }}
                    >
                      Aplicar Período Personalizado
                    </Button>
                  </Col>
                </Row>
              )}
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
                  <Col className='text-white-50' md={4}><strong>Latitude:</strong> {locationInfo.lat}</Col>
                  <Col className='text-white-50' md={4}><strong>Longitude:</strong> {locationInfo.lon}</Col>
                  <Col className='text-white-50' md={4}>
                    <strong>Período:</strong> {getCurrentIntervalLabel()}
                    {selectedInterval === 'custom' && customStartDate && (
                      <small className="d-block">
                        {customStartDate} até {customEndDate || 'hoje'}
                      </small>
                    )}
                  </Col>
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