
## WeatherWatch

### What is WeatherWatch?

WeatherWatch is a web application that displays weather forecast information in an analog clock face format.
WeatherWatch is built with Meteor.js and the front-end is implemented with React.js.

The weather forecast information is obtained using the Open Data API by the Finnish Meteorological Institute (https://en.ilmatieteenlaitos.fi/open-data).

The weather icons are originally from https://github.com/fmidev/opendata-resources/tree/master/symbols. A night version for each icon has been created and some small tweaks have been applied to achieve better symmetry.

WeatherWatch is running in https://weatherwatch.tech

### Requirements

The following are required to run the project:

- `docker`
- `docker-compose`

### Getting started

In order to access the Open Data API an API-key is needed.
An API-key can be obtained by registering to the Open Data service.
After you have obtained your API-key, create a file `settings.json` to the `app/` directory with the following contents:

```
{
    "public": {},
    "private": {
        "apikey": "INSERT-YOUR-APIKEY-HERE"
    }
}
```

The server can access the API-key through `Meteor.settings.private.apikey`.

To start the development environment run the `run-dev-environment.sh` script.
The application can be accessed in http://localhost:3000/.

To start the production environment run the `run-prod-environment.sh` script.
The application is served to port `5000`.

### License

This project is distributed under the [MIT License](http://opensource.org/licenses/MIT).
