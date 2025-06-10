# Clima Vision - Dashboard Meteorológico Interativo

![Clima Vision Screenshot](https://i.imgur.com/uR1yR5k.png)
*(Recomendo que você substitua o link acima por um screenshot real do seu projeto em execução!)*

## 📖 Sobre o Projeto

**Clima Vision** é um dashboard web elegante e moderno, construído em React, que permite aos usuários visualizar dados meteorológicos históricos dos últimos três meses para qualquer cidade do mundo. A aplicação possui uma interface em *dark mode*, focada em uma experiência de usuário limpa e na apresentação clara de dados através de gráficos interativos.

## ✨ Funcionalidades

-   **Busca Global de Cidades:** Encontre dados climáticos para qualquer cidade utilizando a busca integrada.
-   **Interface Dark Mode:** Um design sofisticado e confortável para os olhos, ideal para análise de dados.
-   **Visualização de Localização:** Exibe informações geográficas detalhadas da cidade pesquisada, como nome completo, latitude e longitude.
-   **Gráficos de Linha:** Acompanhe a variação diária de temperatura e precipitação ao longo dos últimos três meses.
-   **Gráficos Boxplot:** Analise a distribuição estatística mensal de múltiplas variáveis climáticas, incluindo:
    -   Temperatura (°C)
    -   Umidade Relativa (%)
    -   Precipitação (mm)
    -   Radiação Solar (W/m²)
-   **Design Responsivo:** A interface se adapta perfeitamente a desktops, tablets e dispositivos móveis.

## 🛠️ Tecnologias e Ferramentas

Este projeto foi construído utilizando um conjunto de tecnologias modernas para o desenvolvimento web:

-   **Frontend:** [React](https://reactjs.org/)
-   **Componentes de UI:** [React-Bootstrap](https://react-bootstrap.github.io/)
-   **Estilização:** [Bootstrap 5](https://getbootstrap.com/) e CSS-in-JS para o tema escuro.
-   **Visualização de Dados:** [Plotly.js](https://plotly.com/javascript/) através do wrapper [react-plotly.js](https://github.com/plotly/react-plotly.js).
-   **Manipulação de Datas:** [date-fns](https://date-fns.org/)
-   **Ícones:** [React Icons](https://react-icons.github.io/react-icons/)

## 🌐 APIs Utilizadas

O coração do Clima Vision são duas APIs abertas e de alta qualidade que fornecem os dados necessários:

1.  **Open-Meteo (Dados Meteorológicos)**
    -   **Propósito:** Fornece dados meteorológicos históricos de alta resolução para qualquer coordenada no globo. É uma API gratuita e de código aberto.
    -   **Endpoint Exemplo:** `https://archive-api.open-meteo.com/v1/archive?latitude=...&longitude=...`
    -   **Website:** [open-meteo.com](https://open-meteo.com/)

2.  **Nominatim - OpenStreetMap (Geocodificação)**
    -   **Propósito:** Converte nomes de lugares (como "São Paulo") em coordenadas geográficas (latitude e longitude), um processo conhecido como geocodificação.
    -   **Endpoint Exemplo:** `https://nominatim.openstreetmap.org/search?q=...&format=json`
    -   **Website:** [nominatim.org](https://nominatim.org/)

## 🚀 Como Executar o Projeto Localmente

Para clonar e executar esta aplicação em sua máquina local, siga os passos abaixo. Você precisará ter o [Node.js](https://nodejs.org/) (versão 16 ou superior) e o `npm` ou `yarn` instalados.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/NOME_DO_SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_SEU_REPOSITORIO.git)
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd NOME_DO_SEU_REPOSITORIO
    ```

3.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```
    *ou, se você usa o yarn:*
    ```bash
    yarn install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```
    *ou:*
    ```bash
    yarn start
    ```

5.  **Abra seu navegador:**
    A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 📂 Estrutura do Projeto

A estrutura de arquivos principal da aplicação está organizada da seguinte forma:

```
/
|-- /public
|-- /src
|   |-- /components
|   |   |-- BoxplotWeather.js   # Componente para os gráficos de boxplot
|   |   `-- LineChartWeather.js   # Componente para o gráfico de linhas
|   |-- /repo
|   |   `-- openMeteo.js          # Lógica para buscar dados da API Open-Meteo
|   |-- App.js                  # Componente principal da aplicação
|   |-- index.js                # Ponto de entrada do React
|   `-- ...
|-- .gitignore
|-- package.json
`-- README.md
```
## 👨‍💻 Contato

<p>
    <img 
      align=left 
      margin=10 
      width=80 
      src="https://avatars.githubusercontent.com/u/80135269?v=4"
    />
    <p>&nbsp&nbsp&nbspManuela Bertella Ossanes<br>
    &nbsp&nbsp&nbsp
    <a href="https://github.com/manuabigsz">
    GitHub</a>&nbsp;|&nbsp;
    <a href="https://www.linkedin.com/in/manuela-bertella-ossanes-690166204/">LinkedIn</a>
&nbsp;|&nbsp;
    <a href="https://www.instagram.com/manuossz/">
    Instagram</a>
&nbsp;|&nbsp;</p>
</p>
<br/><br/>
<p>