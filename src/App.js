import React from 'react';
import { getLocation } from './utils';
import './App.css';
import { Weather } from './components/Weather';
import { SearchForm } from './components/SearchForm';

const API_URL = 'http://api.openweathermap.org/data/2.5';
const API_KEY = '051150af1472493cc78c677d8f4fccb5';

class App extends React.Component {
  state = {
    lon: '',
    lat: '',
    query: '',
    data: undefined
  }

  async componentDidMount() {
    const { coords } = await getLocation()
    this.setState((state) => ({ ...state, lon: coords.longitude.toFixed(2), lat: coords.latitude.toFixed(2) }));
    this.fetchWeather()
  }

  fetchWeather = async () => {
    const { lon, lat } = this.state;
    const response = await fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    this.setCurrentWeather(data);
  }

  setCurrentWeather = data => {
    const {
      main: { temp, feels_like },
      wind: { speed: wind_speed, deg: wind_degree},
      sys: { country, sunrise, sunset },
      name,
      weather
    } = data;
    this.setState(state => {
      return {
        ...state,
        data: {
          temp,
          feels_like,
          wind_speed,
          wind_degree,
          country,
          sunrise,
          sunset,
          name,
          weather
        }
      };
    });
  };

  search = async value =>  {
    try {
      const response = await fetch(
        `${API_URL}/weather?appid=${API_KEY}&q=${value}&units=metric`
      );
      const data = await response.json();
      this.setCurrentWeather(data);
    } catch (e) {
      throw e;
    }
  }

  renderContent() {
    return(
      this.state.data ? 
      <>
        <SearchForm  onSubmit={this.search} />
        <Weather {...this.state.data} />
      </>   : 'Loading...'
    )
  }

  render() {
    return (
      <div className="app__container">
        <div className="app__content">
         {this.renderContent()}
        </div>
      </div>
    )
  }
}

export default App;
