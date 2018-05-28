import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import {Controller} from '/imports/api/domains/controller.js';
import {Colors} from '/lib/colors.js';
import {withTracker} from 'meteor/react-meteor-data';


class Settings extends React.Component {

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "DOT_MENU_CLOSE_BUTTON_CLICKED"
		});
	}

	tzModeToggled() {
		Dispatcher.dispatch({
			actionType: "FORECAST_TIMEZONE_TOGGLED"
		});
	}

	gradientModeToggled() {
		Dispatcher.dispatch({
			actionType: "GRADIENT_MODE_TOGGLED"
		});
	}

	secondHandToggled() {
		Dispatcher.dispatch({
			actionType: "CLOCK_SECOND_HAND_TOGGLED"
		});
	}

	colorThemeChange(event) {
		Dispatcher.dispatch({
			actionType: "COLOR_THEME_SELECTED",
			data: event.target.value
		});
	}

	hueChange(event, value) {
		Dispatcher.dispatch({
			actionType: "HUE_CHANGED",
			data: value
		});
	}

	unitModeChange(event) {
		Dispatcher.dispatch({
			actionType: "UNIT_MODE_SELECTED",
			data: event.target.value
		});
	}

	clockSizeChange(event) {
		Dispatcher.dispatch({
			actionType: "CLOCK_SIZE_SELECTED",
			data: event.target.value
		});
	}

	render() {

		const selectFieldStyle = {
			color: this.props.colorTheme.text.light,
			width: '280px',
			maxWidth: "100%"
		};

		const colorThemeItems = this.props.colorThemes.map(function(item) {
			return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
		});

		const unitModeItems = this.props.availableUnitModes.map(function(item) {
			return <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>;
		});

		const clockSizeItems = this.props.availableClockSizes.map(function(item) {
			return <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>;
		});

		const settings = (
			<div className="settings-container">
				<div className="settings-check-boxes">
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.props.clockSettings.gradientMode}
									onChange={this.gradientModeToggled}
								/>
							}
							label="Gradient mode"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.props.clockSettings.forecastTimezone}
									onChange={this.tzModeToggled}
								/>
							}
							label="Forecast timezone"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.props.clockSettings.secondHand}
									onChange={this.secondHandToggled}
								/>
							}
							label="Second hand"
						/>
					</FormGroup>
				</div>
				<FormGroup>
					<FormControl>
						<InputLabel>Color theme</InputLabel>
						<Select
							value={this.props.colorTheme.id}
							onChange={this.colorThemeChange}
							style={selectFieldStyle}
							className="select-field"
						>
							{colorThemeItems}
						</Select>
					</FormControl>
					<br />
					<FormControl>
						<InputLabel>Units</InputLabel>
						<Select
							value={this.props.clockSettings.unitMode.id}
							onChange={this.unitModeChange}
							style={selectFieldStyle}
							className="select-field"
						>
							{unitModeItems}
						</Select>
					</FormControl>
					<br />
					<FormControl>
						<InputLabel>Clock size</InputLabel>
						<Select
							value={this.props.clockSettings.clockSize.id}
							onChange={this.clockSizeChange}
							style={selectFieldStyle}
							className="select-field"
						>
							{clockSizeItems}
						</Select>
					</FormControl>
				</FormGroup>
			</div>
		);

		return (
			<div>
				<Dialog
					open={this.props.open}
					onClose={this.handleDialogClose}
				>
					<DialogTitle>{"Settings"}</DialogTitle>
					<DialogContent>
						{settings}
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleDialogClose} autoFocus>
							CLOSE
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default SettingsContainer = withTracker(props => {
	return {
		open: Controller.settingsOpen(),
		clockSettings: Controller.getClockSettings(),
		availableUnitModes: Controller.getAvailableUnitModes(),
		availableClockSizes: Controller.getAvailableClockSizes(),
		colorTheme: Controller.getColorTheme(),
		colorThemes: Colors.getColorThemes(),
		hue: Controller.getHue()
	};
})(Settings);
