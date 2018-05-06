import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';


export const ButtonRow = React.createClass({

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

		const settingsOpen = this.props.settingsOpen;
		const clockSettings = this.props.clockSettings

		const futureBtnClasses = classNames({
			"fa": true,
			"fa-clock-o": true
		});

		const dotMenuBtnClasses = classNames({
			"fa": true,
			"fa-ellipsis-v": true
		});

		const dotMenuBtnStyle = {
			width: '36px',
			minWidth: '36px'
		};

		const dataMenuButtonActiveClasses = classNames({
			"bottom-button-active": this.state.dataMenuOpen
		});

		const dotMenuButtonActiveClasses = classNames({
			"bottom-button-active": settingsOpen
		});

		const futureButtonActiveClasses = classNames({
			"bottom-button-active": clockSettings.futureMode
		});

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
			return (
				<MenuItem
					className={itemClasses}
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
					className={dataMenuButtonActiveClasses}
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
					primary={true}
					onTouchTap={this.dotMenuButtonClick}
					className={dotMenuButtonActiveClasses}
					style={dotMenuBtnStyle}
				/>
				<FlatButton
					icon={<i className={futureBtnClasses} />}
					label="+12h"
					primary={true}
					onTouchTap={this.futureButtonClick}
					className={futureButtonActiveClasses}
				/>
			</div>
		);
	}
});