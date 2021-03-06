import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Helpers} from '/lib/helpers.js';
import {WeatherController} from '/imports/api/domains/weather.js';
import {Controller} from '/imports/api/domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';


class TopElement extends React.Component {

	constructor(props) {
		super(props);

		this.searchButtonClicked = this.searchButtonClicked.bind(this);
		this.locationButtonClicked = this.locationButtonClicked.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.clearInput = this.clearInput.bind(this);

		this.state = {
			locationText: ""
		}
	}

	searchButtonClicked() {
		Dispatcher.dispatch({
			actionType: "SEARCH_BUTTON_CLICKED",
			data: this.state.locationText
		});
		this.clearInput();
		Helpers.hideVirtualKeyboard();
	}

	locationButtonClicked() {
		Dispatcher.dispatch({
			actionType: "GET_LOCATION_BUTTON_CLICKED"
		});
	}

	onKeyPress(event) {
		// On enter key press
		if (event.charCode === 13) {
			event.preventDefault();
			this.searchButtonClicked();
		}
	}

	handleInputChange(event) {
		this.setState({
			locationText: event.target.value
		})
	}

	clearInput() {
		this.setState({
			locationText: ""
		})
	}

	render() {

		const locationDisabled = !navigator.geolocation;

		const locationBtnClasses = classNames({
			"fa": true,
			"fa-map-marker": true
		});

		const searchBtnClasses = classNames({
			"fa": true,
			"fa-search": true
		});

		const buttonStyle = {
			width: '36px',
			minWidth: '36px',
			fontSize: '16px'
		};

		var loader;
		if (this.props.weatherLoading) {
			loader = (
				<LinearProgress
					style={{ backgroundColor: this.props.colorTheme.bg.light, "height": "2px" }}
					mode="indeterminate"
				/>
			);
		} else {
			loader = null;
		}

		return (
			<div className="top-container">
				<div className="top-wrapper">
					<div className="location-input-container">
						<form>
							<div className="location-button-container align-left">
								<Button
									onClick={this.locationButtonClicked}
									style={buttonStyle}
									disabled={locationDisabled}
								>
									<i className={locationBtnClasses} />
								</Button>
							</div>
							<TextField
								className="location-input-field"
								placeholder="Location"
								onKeyPress={this.onKeyPress}
								value={this.state.locationText}
								onChange={this.handleInputChange}
							/>
							<div className="location-button-container align-right">
								<Button
									onClick={this.searchButtonClicked}
									style={buttonStyle}
								>
									<i className={searchBtnClasses} />
								</Button>
							</div>
						</form>
					</div>
					<div className="loader-container">
						{loader}
					</div>
				</div>
			</div>
		);
	}
}

export default TopElementContainer = withTracker(props => {
	return {
		weatherLoading: WeatherController.getLoading(),
		colorTheme: Controller.getColorTheme()
	};
})(TopElement);
