import React,{ useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import TableL from './TableL';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";



function App() {
  // State means variable in react
  // https://disease.sh/v3/covid-19/countries
  // useEffect : Runs a piece of code based on given condition

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(
      response => response.json()
    ).then(
      data => {
        setCountryInfo(data);
      }
    );
  }, []);

  useEffect(() => {
    // code inside it runs here once when the component loads and not again
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then(
        (response) => response.json()
      ).then(
        (data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        }
      );
    };
    getCountriesData();
  }, [countries]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // setCountry(countryCode);
    // https://disease.sh/v3/covid-19/all (World Wide)
    // https://disease.sh/v3/covid-19/countries/[country-code]

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url).then(
      response => response.json()
    ).then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  // console.log(countryInfo);

  return (
    <div className="app">
      <div className="app-left">
        <div className="app-header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app-dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              
              <MenuItem value="worldwide">World Wide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{ country.name }</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app-stats">
              <InfoBox isRed active={casesType === 'cases'} onClick={(e) => setCasesType("cases")} title="Coronavirus Cases" cases={ prettyPrintStat(countryInfo.todayCases) } total={prettyPrintStat(countryInfo.cases)} />
              <InfoBox active={casesType === 'recovered'} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={ prettyPrintStat(countryInfo.todayRecovered) } total={prettyPrintStat(countryInfo.recovered)} />
              <InfoBox isRed active={casesType === 'deaths'} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={ prettyPrintStat(countryInfo.todayDeaths) } total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        <Map 
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app-right">
             <CardContent>
               <h3>Live Cases by Country</h3>
               <TableL countries={tableData} />
               <h3 className="app-graphTitle">WorldWide new {casesType}</h3>
               <LineGraph className="app-graph" casesType={casesType} />
             </CardContent> 
      </Card>
    </div>
  );
}

export default App;
