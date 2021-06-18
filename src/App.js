import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
// import LineGraph from './LineGraph';
import './App.css';
import {MenuItem,FormControl,Select,Card,CardContent} from "@material-ui/core";
import { useEffect, useState } from 'react';
import { prettyPrintStat, sortData } from './util';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType,setCasesType] =useState("cases")


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=> response.json())
    .then(data =>{
      
      setCountryInfo(data);
    })
  },[])
  // state is a short time memory
  // STATE= how to write a variable in react

  // https://disease.sh/v3/covid-19/countries


  //USEEFFECT =runs a peice of code based on a given conditions.
  useEffect(()=>{
    //the code inside here will run once 
    //when the component loads and not again
    //async->sends a request to Server,wait for it, do something with info.
    
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data) => {
        const countries = data.map((country)=>(
          {
            name: country.country, //United States,India
            value: country.countryInfo.iso2 //UK,USA,FR
          }));
          
          const sortedData=sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
          // console.log("data",data);
          
          
      });
    };
    getCountriesData();
  },[countries]);

  const onCountryChange =async (event) =>{
    const countryCode =event.target.value;
    

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  }


  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">  
{/* header */}
      <h1>COVID-19 TRACKER</h1>
      {/* all these Select,menuItems,formcontrol are from material ui */}
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country} >

          {/* I want-->to loop through all the countries
           and shows the name of all the countries */}

            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) =>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          

          {/* <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">option 2</MenuItem>
          <MenuItem value="worldwide">option 3</MenuItem>
          <MenuItem value="worldwide">yooo</MenuItem> */}
        </Select>
      </FormControl>
      </div>
      
      <div className="app__stats">
          {/* infoboxs */}
          <InfoBox active={casesType === "cases"} onClick={(e) => setCasesType("cases")} isRed title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox active={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} isRed title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>

      </div>

        {/* table */}
        {/* graph */}

        {/* map  */}
        <Map
        countries={mapCountries}
        casesType={casesType}
        center={mapCenter}
        zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            
            {/* <LineGraph casesType={casesType}/> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
