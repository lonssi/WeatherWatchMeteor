import React from 'react';
import {WeatherController} from '../domains/weather.js';
import {Controller} from '../domains/controller.js';
import {ButtonRow} from './ButtonRow.jsx';
import {WeatherClockCanvas} from './WeatherClockCanvas.js';
import {Colors} from '../../lib/colors.js';


export const WeatherClock = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			images: Controller.getImages(),
			imagesReady: Controller.imagesReady(),
			weatherData: WeatherController.getWeatherData(),
			location: WeatherController.getLocation(),
			clockSettings: Controller.getClockSettings(),
			availableDataModes: Controller.getAvailableDataModes(),
			settingsOpen: Controller.settingsOpen()
		};
	},

	clearWeatherClock() {
		clearInterval(this.clockupdate);
		this.weatherclock.clear();
		this.canvasIsInitialized = false;
		this.canvasReadyForInitialization = true;
		this.weatherclock = null;
	},

	componentWillUpdate() {

		if (this.data.weatherData && this.canvasReadyForInitialization && this.data.imagesReady) {
			this.initializeCanvas();
		}

		if (this.weatherclock) {
			this.weatherclock.setSettings(this.data.clockSettings);
			this.weatherclock.updateWeatherData(this.data.weatherData);
			this.weatherclock.update(true);
		}

		if (this.weatherclock && !this.data.weatherData) {
			this.clearWeatherClock();
		}
	},

	componentDidMount() {

		this.resizeThrottle = _.throttle(this.resize, 100);
		window.addEventListener('resize', this.resizeThrottle);

		this.canvasReadyForInitialization = true;

		if (this.data.weatherData && this.canvasReadyForInitialization && this.data.imagesReady) {
			this.initializeCanvas();
			this.forceUpdate();
		}
	},

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeThrottle);
		this.clearWeatherClock();
	},

	resize() {
		if (this.weatherclock) {
			this.weatherclock.update(true);
		}
	},

	initializeCanvas() {

		this.canvasReadyForInitialization = false;
		this.canvasIsInitialized = true;

		this.weatherclock = new WeatherClockCanvas(
			this.refs.canvas,
			this.data.images,
			this.data.weatherData,
			this.data.clockSettings,
			this.refs.container,
			Colors.colorTheme
		);

		this.weatherclock.update(true);

		var self = this;
		this.clockupdate = setInterval(function() {
			self.weatherclock.update(false);
		}, 5000);
	},

	getBottomSection() {

		const forecastTimezone = this.data.clockSettings.forecastTimezone;
		const updateTime = this.data.weatherData.time;

		const tz = (forecastTimezone) ? { timeZone: this.data.weatherData.timeZone } : {};
		const tzHours = (forecastTimezone) ? this.data.weatherData.timeZoneOffset
			: -(new Date().getTimezoneOffset() / 60);
		const prefix = (tzHours >= 0) ? "+" : "";

		const updatedText = "last updated: " + updateTime.toLocaleString('en-GB', tz) + " " +
			"UTC" + prefix + tzHours;
		const disclaimerText = "weather data by finnish meteorological institute";

		return (
			<div className="bottom-section-container">
				<div className="last-updated-container">
					{updatedText}
					<br/>
					{disclaimerText}
				</div>
				<ButtonRow
					settingsOpen={this.data.settingsOpen}
					clockSettings={this.data.clockSettings}
					availableDataModes={this.data.availableDataModes}
				/>
			</div>
		);
	},

	render() {

		var locationText, bottomSection;

		if (this.weatherclock) {

			locationText = (
				<div className='location-text-container'>
					{this.data.location}
				</div>
			);

			bottomSection = this.getBottomSection();
		}

		return (
			<div className="width-100 height-100">
				{locationText}
				<div className="weather-clock-container" ref="container">
					<canvas ref="canvas"/>
				</div>
				{bottomSection}
			</div>
		);
	}
});
