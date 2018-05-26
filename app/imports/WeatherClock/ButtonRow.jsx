import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Controller} from '../domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';


class ButtonRow extends React.Component {

	constructor(props) {
		super(props);

		this.futureButtonClick = this.futureButtonClick.bind(this);
		this.dataModeButtonClick = this.dataModeButtonClick.bind(this);
		this.dotMenuButtonClick = this.dotMenuButtonClick.bind(this);
		this.aboutDialogButtonClick = this.aboutDialogButtonClick.bind(this);
		this.handleDataMenuTouchTap = this.handleDataMenuTouchTap.bind(this);
		this.handleDataMenuRequestClose = this.handleDataMenuRequestClose.bind(this);

		this.state = {
			dataMenuOpen: false
		};
	}

	futureButtonClick() {
		Dispatcher.dispatch({
			actionType: "FUTURE_BUTTON_CLICKED"
		});
	}

	dataModeButtonClick(data) {
		Dispatcher.dispatch({
			actionType: "DATA_MODE_BUTTON_CLICKED",
			data: data
		});
		this.handleDataMenuRequestClose();
	}

	dotMenuButtonClick() {
		Dispatcher.dispatch({
			actionType: "DOT_MENU_OPEN_BUTTON_CLICKED",
		});
	}

	aboutDialogButtonClick() {
		Dispatcher.dispatch({
			actionType: "ABOUT_DIALOG_OPEN_BUTTON_CLICKED",
		});
	}

	handleDataMenuTouchTap(event) {
		// This prevents ghost click
		event.preventDefault();
		this.setState({
			dataMenuOpen: true,
			anchorEl: event.currentTarget,
		});
	}

	handleDataMenuRequestClose() {
		this.setState({
			dataMenuOpen: false,
		});
	}

	render() {

		const settingsOpen = this.props.settingsOpen;
		const aboutDialogOpen = this.props.aboutDialogOpen;
		const clockSettings = this.props.clockSettings
		const colorTheme = this.props.colorTheme;

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

		const dataModeItems = this.props.availableDataModes.map(function(item) {

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
}

export default ButtonRowContainer = withTracker(props => {
	return {
		clockSettings: Controller.getClockSettings(),
		availableDataModes: Controller.getAvailableDataModes(),
		settingsOpen: Controller.settingsOpen(),
		aboutDialogOpen: Controller.aboutDialogOpen(),
		colorTheme: Controller.getColorTheme()
	};
})(ButtonRow);
