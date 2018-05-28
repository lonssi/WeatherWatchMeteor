import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import {Controller} from '/imports/api/domains/controller.js';
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

		const iconStyle = {
			fontSize: '16px',
			lineHeight: '16px',
			textAlign: 'center'
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
			return (
				<MenuItem
					selected={item.id === clockSettings.dataMode.id}
					key={item.id}
					onClick={this.dataModeButtonClick.bind(null, item.id)}
				>
					<ListItemIcon>
						<div className="unit-icon-container">
							<i className={"fa " + item.icon}/>
						</div>
					</ListItemIcon>
					<ListItemText inset primary={item.text} />
				</MenuItem>
			);
		}.bind(this));

		const dataModeIconClasses = "fa " + clockSettings.dataMode.icon;

		return (
			<div className="button-row-container">
				<Button
					onClick={this.handleDataMenuTouchTap}
					style={dataMenuButtonStyle}
				>
					<div className="button-unit-icon-container">
						<i className={dataModeIconClasses}/>
					</div>
					data
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={this.state.anchorEl}
					open={this.state.dataMenuOpen}
					onClose={this.handleDataMenuRequestClose}
				>
					{dataModeItems}
				</Menu>

				<Button
					onClick={this.dotMenuButtonClick}
					style={dotMenuBtnStyle}
				>
					<Icon className={dotMenuBtnClasses} style={iconStyle}></Icon>
				</Button>
				<Button
					onClick={this.aboutDialogButtonClick}
					style={aboutDialogBtnStyle}
				>
					<Icon className={"fa fa-question"} style={iconStyle}></Icon>
				</Button>
				<Button
					onClick={this.futureButtonClick}
					style={futureButtonStyle}
				>
					<div className="button-unit-icon-container">
						<i className={futureBtnClasses}/>
					</div>
					+12h
				</Button>
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
