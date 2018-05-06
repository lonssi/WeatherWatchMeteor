import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Colors} from '../../lib/colors.js';
import {WeatherController} from '../domains/weather.js';
import {WeatherClock} from '../WeatherClock/WeatherClock.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Spinner} from '../../lib/react-plugins/spinner/Spinner.jsx';
import {Helpers} from '../../lib/helpers.js';
import {SettingsMenu} from '../WeatherClock/Settings.jsx';
import xss from 'xss';


const colorTheme = Colors.colorTheme;
const muiTheme = getMuiTheme({
	palette: {
		primary1Color: colorTheme.text_light,
		textColor: colorTheme.text_light,
		borderColor: colorTheme.text_darker,
		disabledColor: colorTheme.text_dark,
		canvasColor: colorTheme.background_dark,
		alternateTextColor: colorTheme.background_dark,
		accent1Color: colorTheme.accent_light
	}
});

export const LocationInput = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			weatherStatus: WeatherController.getStatus(),
			weatherLoading: WeatherController.getLoading()
		};
	},

	getInitialState() {
		return {
			locationText: ""
		}
	},

	searchButtonClicked() {
		const userInput = xss(this.refs.locationTextfield.input.value);
		Dispatcher.dispatch({
			actionType: "SEARCH_BUTTON_CLICKED",
			data: userInput
		});
		this.clearInput();
		Helpers.hideVirtualKeyboard();
	},

	locationButtonClicked() {
		Dispatcher.dispatch({
			actionType: "GET_LOCATION_BUTTON_CLICKED"
		});
	},

	onKeyPress(event) {
		// On enter key press
		if (event.charCode === 13) {
			event.preventDefault();
			this.searchButtonClicked();
		}
	},

	handleInputChange(event) {
	    this.setState({
	        locationText: event.target.value
	    })
	},

	clearInput() {
	    this.setState({
	        locationText: ""
	    })
	},

	render() {

		const spinner = (this.data.weatherLoading) ? <Spinner /> : null;
		const locationDisabled = !navigator.geolocation;

		const locationBtnClasses = classNames({
			"fa": true,
			"fa-crosshairs": true
		});

		const searchBtnClasses = classNames({
			"fa": true,
			"fa-search": true
		});

		const buttonStyle = {
			width: '36px',
			minWidth: '36px'
		};

		return (
			<div className="location-input-container">
				<form>
					<div className="location-button-container">
						<FlatButton
							icon={<i className={locationBtnClasses} />}
							primary={true}
							onTouchTap={this.locationButtonClicked}
							style={buttonStyle}
							disabled={locationDisabled}
						/>
					</div>
					<TextField
						className="location-input-field"
						hintText="Location"
						ref='locationTextfield'
						onKeyPress={this.onKeyPress}
						value={this.state.locationText}
						onChange={this.handleInputChange}
					/>
					<div className="location-button-container">
						<FlatButton
							icon={<i className={searchBtnClasses} />}
							primary={true}
							onTouchTap={this.searchButtonClicked}
							style={buttonStyle}
						/>
					</div>
				</form>
				<div className="weather-status-container">
					{spinner}
					{this.data.weatherStatus}
				</div>
			</div>
		);
	}
});

export const AppLayout = React.createClass({

	componentDidMount() {
		Dispatcher.dispatch({
			actionType: "CLIENT_INITIALIZED"
		});
	},

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div className="content-container">
					<SettingsMenu />
					<div className="top-container">
						<LocationInput />
					</div>
					<div className="bottom-container">
						<WeatherClock />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
});
