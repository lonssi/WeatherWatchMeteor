import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Controller} from '../domains/controller.js';


export const ButtonRow = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			clockSettings: Controller.getClockSettings(),
			availableDataModes: Controller.getAvailableDataModes(),
			settingsOpen: Controller.settingsOpen(),
			aboutDialogOpen: Controller.aboutDialogOpen(),
			colorTheme: Controller.getColorTheme()
		};
	},

	getInitialState() {
		return {
			dataMenuOpen: false
		};
	},

	futureButtonClick() {
		Dispatcher.dispatch({
			actionType: "FUTURE_BUTTON_CLICKED"
		});
	},

	dataModeButtonClick(data) {
		Dispatcher.dispatch({
			actionType: "DATA_MODE_BUTTON_CLICKED",
			data: data
		});
		this.handleDataMenuRequestClose();
	},

	dotMenuButtonClick() {
		Dispatcher.dispatch({
			actionType: "DOT_MENU_OPEN_BUTTON_CLICKED",
		});
	},

	aboutDialogButtonClick() {
		Dispatcher.dispatch({
			actionType: "ABOUT_DIALOG_OPEN_BUTTON_CLICKED",
		});
	},

	handleDataMenuTouchTap(event) {
		// This prevents ghost click
		event.preventDefault();
		this.setState({
			dataMenuOpen: true,
			anchorEl: event.currentTarget,
		});
	},

	handleDataMenuRequestClose() {
		this.setState({
			dataMenuOpen: false,
		});
	},

	render() {

		const settingsOpen = this.data.settingsOpen;
		const aboutDialogOpen = this.data.aboutDialogOpen;
		const clockSettings = this.data.clockSettings
		const colorTheme = this.data.colorTheme;

		const futureBtnClasses = classNames({
			"fa": true,
			"fa-clock-o": true
		});

		const dotMenuBtnClasses = classNames({
			"fa": true,
			"fa-ellipsis-v": true
		});

		const smallButtonStyle = {
			width: '36px',
			minWidth: '36px'
		};

		const dotMenuBtnStyle = (settingsOpen)
			? _.assign({}, smallButtonStyle, { backgroundColor: colorTheme.bg.dark })
			: smallButtonStyle;

		const aboutDialogBtnStyle = (aboutDialogOpen)
			? _.assign({}, smallButtonStyle, { backgroundColor: colorTheme.bg.dark })
			: smallButtonStyle;

		const dataMenuButtonStyle = (this.state.dataMenuOpen) ?
			{ backgroundColor: colorTheme.bg.dark } : {};

		const futureButtonStyle = (clockSettings.futureMode) ?
			{ backgroundColor: colorTheme.bg.dark } : {};

		const dataModeItems = this.data.availableDataModes.map(function(item) {

			const itemClasses = classNames({
				"menu-item-selected": item.id === clockSettings.dataMode.id
			});

			const buttonClasses = "fa " + item.icon;

			const leftIcon = (
				<div>
					<div className="unit-icon-container">
						<i className={buttonClasses} />
					</div>
				</div>
			);

			const itemStyle = (item.id === clockSettings.dataMode.id) ?
				{backgroundColor: colorTheme.bg.darker} : {};

			return (
				<MenuItem
					style={itemStyle}
					primaryText={item.text}
					key={item.id}
					onClick={this.dataModeButtonClick.bind(null, item.id)}
					leftIcon={leftIcon}
				/>
			);
		}.bind(this));

		return (
			<div className="button-row-container">
				<FlatButton
					onClick={this.handleDataMenuTouchTap}
					icon={<i className={"fa " + clockSettings.dataMode.icon} />}
					label="data"
					style={dataMenuButtonStyle}
				/>
				<Popover
					open={this.state.dataMenuOpen}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
					targetOrigin={{horizontal: 'left', vertical: 'top'}}
					onRequestClose={this.handleDataMenuRequestClose}
				>
					<Menu>
						{dataModeItems}
					</Menu>
				</Popover>
				<FlatButton
					icon={<i className={dotMenuBtnClasses} />}
					onTouchTap={this.dotMenuButtonClick}
					style={dotMenuBtnStyle}
				/>
				<FlatButton
					label="?"
					onTouchTap={this.aboutDialogButtonClick}
					style={aboutDialogBtnStyle}
					labelStyle={{ fontWeight: 'bold' }}
				/>
				<FlatButton
					icon={<i className={futureBtnClasses} />}
					label="+12h"
					onTouchTap={this.futureButtonClick}
					style={futureButtonStyle}
				/>
			</div>
		);
	}
});