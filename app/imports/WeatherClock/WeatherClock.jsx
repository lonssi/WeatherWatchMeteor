import React from 'react';
import {WeatherController} from '../domains/weather.js';
import ButtonRowContainer from './ButtonRow.jsx';
import {WeatherClockCanvas} from './WeatherClockCanvas.js';
import {Helpers} from '../../lib/helpers.js';
import {Controller} from '../domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';


class WeatherClock extends React.Component {

	constructor(props) {
		super(props);

		this.weatherclock = null;
		this.canvasReadyForInitialization = true;
		this.canvasIsInitialized = false;

		this.clearWeatherClock = this.clearWeatherClock.bind(this);
		this.clockUpdate = this.clockUpdate.bind(this);
		this.resize = this.resize.bind(this);
		this.initializeCanvas = this.initializeCanvas.bind(this);
		this.getBottomSection = this.getBottomSection.bind(this);

		this.resizeThrottle = _.throttle(this.resize, 200);
		window.addEventListener('resize', this.resizeThrottle);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeThrottle);
		this.clearWeatherClock();
	}

	clockUpdate(flag) {
		// If the application resumes after sleep
		// the data may have become outdated
		if (Helpers.dataIsOutdated(this.props.weatherData, false)) {
			this.clearWeatherClock();
			WeatherController.resetWeather(true);
		} else {
			this.weatherclock.update(flag);
		}
	}

	resize() {
		if (this.weatherclock) {
			this.clockUpdate(true);
		}
	}

	initializeCanvas() {

		this.canvasReadyForInitialization = false;
		this.canvasIsInitialized = true;

		this.weatherclock = new WeatherClockCanvas(
			this.refs.canvas,
			this.props.images,
			this.props.weatherData,
			this.props.clockSettings,
			this.refs.container,
			this.props.colorTheme
		);

		this.clockUpdate(true);

		var self = this;
		this.clockUpdateInterval = setInterval(function() {
			self.clockUpdate(false);
		}, 100);
	}

	clearWeatherClock() {

		if (this.clockUpdateInterval) {
			clearInterval(this.clockUpdateInterval);
		}

		if (this.weatherclock) {
			this.weatherclock.clear();
			this.canvasIsInitialized = false;
			this.canvasReadyForInitialization = true;
			this.weatherclock = null;
		}
	}

	getBottomSection() {

		const forecastTimezone = this.props.clockSettings.forecastTimezone;
		const updateTime = this.props.weatherData.time;
		const colorTheme = this.props.colorTheme;

		const tz = (forecastTimezone) ? { timeZone: this.props.weatherData.timeZone } : {};
		const tzHours = (forecastTimezone) ? this.props.weatherData.timeZoneOffset
			: -(new Date().getTimezoneOffset() / 60);
		const prefix = (tzHours >= 0) ? "+" : "";

		const updatedText = "last updated: " + updateTime.toLocaleString('en-GB', tz) + " " +
			"UTC" + prefix + tzHours;

		const styles = {
			color: colorTheme.text.dark
		};

		return (
			<div className="bottom-section-container">
				<div className="last-updated-container" style={styles}>
					{updatedText}
				</div>
				<ButtonRowContainer/>
			</div>
		);
	}

	render() {

		if (this.props.weatherData && this.canvasReadyForInitialization && this.props.imagesReady) {
			this.initializeCanvas();
		}

		if (this.weatherclock && this.props.weatherData) {
			this.weatherclock.setSettings(this.props.clockSettings);
			this.weatherclock.updateWeatherData(this.props.weatherData);
			this.weatherclock.updateColorTheme(this.props.colorTheme);
			this.clockUpdate(true);
		}

		if (this.weatherclock && !this.props.weatherData) {
			this.clearWeatherClock();
		}

		var locationText, bottomSection;

		if (this.weatherclock) {

			locationText = (
				<div className='location-text-container'>
					{this.props.location}
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
}

export default WeatherClockController = withTracker(props => {

	return {
		images: Controller.getImages(),
		imagesReady: Controller.imagesReady(),
		weatherData: WeatherController.getWeatherData(),
		location: WeatherController.getLocation(),
		clockSettings: Controller.getClockSettings(),
		colorTheme: Controller.getColorTheme()
	};

})(WeatherClock);
