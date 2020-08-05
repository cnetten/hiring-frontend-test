import React, { Component } from "react";
import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class Test extends Component {

  constructor() {
    super();

    this.state = {
        options: [],
          error: null,
          isLoaded: false,
    };

  }
  
  componentDidMount() {
    
    var $ = this;

      Promise.all([
        fetch('https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=2020-07-27&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51'),
        fetch('https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=2020-07-28&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51'),
        fetch('https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=2020-07-29&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51')
    ]).then(function (responses) {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function (result) {

        var temp = [];
        var sol = [];
        var eva = [];

        for(var i =0; i < result.length; i++) {
            temp.push(result[i].meanDailyAirTemperatureC);
            sol.push(result[i].meanSolarRadiationMJ);
            eva.push(result[i].evapotranspirationIN);
        }

      $.setState({
        isLoaded: true,
        options:{
            title: {
                text: 'Evapo Chart'
              },
              xAxis: {
                title: {
                    text: 'Date'
                },
                type: 'datetime',
                labels: {
                    format: '{value:%Y-%m-%d}',
                    rotation: 45,
                    align: 'left'
                }
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                title: {
                    text: 'Values',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
        
            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Evapotranspiration',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                labels: {
                    format: '{value} in',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                }
        
            }],
            tooltip: {
                shared: true
            },
            series: [
                
                { 
                    name: 'Temperature (C)',
                    data: temp  ,
                    pointStart: Date.UTC(2020, 6, 27),
                    pointInterval: 24 * 36e5,
                    yAxis: 0,
                    tooltip: {
                        valueSuffix: ' °C'
                    }

                }
                ,
                {
                    name: 'Solar (MJ)',
                    data: sol,
                    pointStart: Date.UTC(2020, 6, 27),
                    pointInterval: 24 * 36e5,
                    yAxis: 0
                },
                {
                    name: 'Evapo (In)',
                    data: eva,
                    pointStart: Date.UTC(2020, 6, 27),
                    pointInterval: 24 * 36e5,
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: ' in'
                    }
                }
              ]
        } 
    });

    }).catch(function (error) {
        $.setState({
            isLoaded: true,
            error: error
          });
    });
  }

  

  render() {
    const { error, isLoaded, options } = this.state;
    if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
    return (
        <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    );
      }
  }
}

export default Test;

const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Test />, wrapper) : false;