import React from 'react';
import {Controller} from '/imports/api/domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class AboutDialog extends React.Component {

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "ABOUT_DIALOG_CLOSE_BUTTON_CLICKED"
		});
	}

	render() {

		const link = (
			<a href="https://github.com/lonssi/WeatherWatch">
				GitHub
			</a>
		);

		return (
			<Dialog
				open={this.props.open}
				onClose={this.handleDialogClose}
				maxWidth="sm"
			>
				<DialogTitle>{"About"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						The weather data is provided by the Finnish Meteorological Institute.
						<br/>
						<br/>
						WeatherWatch is open source: {link}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleDialogClose} autoFocus>
						CLOSE
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default AboutDialogContainer = withTracker(props => {
	return {
		open: Controller.aboutDialogOpen()
	};
})(AboutDialog);
