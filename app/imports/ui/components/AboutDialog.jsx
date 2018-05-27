import React from 'react';
import {Controller} from '/imports/api/domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Constants} from '/lib/constants.js';


class AboutDialog extends React.Component {

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "ABOUT_DIALOG_CLOSE_BUTTON_CLICKED"
		});
	}

	render() {

		const dialogStyle = {
			maxWidth: Constants.dialogWidth
		};

		const actions = [
			<FlatButton
				label="close"
				onClick={this.handleDialogClose}
			/>
		];

		const link = (
			<a href="https://github.com/lonssi/WeatherWatch">
				GitHub
			</a>
		);

		return (
			<Dialog
				title="About"
				actions={actions}
				modal={false}
				onRequestClose={this.handleDialogClose}
				open={!!this.props.open}
				contentStyle={dialogStyle}
				autoScrollBodyContent={true}
			>
				<p>
					Weather data provided by the Finnish Meteorological Institute.
					<br/>
					<br/>
					WeatherWatch is open source: {link}
				</p>
			</Dialog>
		);
	}
}

export default AboutDialogContainer = withTracker(props => {
	return {
		open: Controller.aboutDialogOpen()
	};
})(AboutDialog);
