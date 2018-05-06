import chroma from 'chroma-js';
import {Helpers} from './helpers.js';

const colorTheme = {
	background_light: '#475663',
	background_dark: '#3E4B57',
	background_darker: '#37434C',
	accent_light: '#E6944C',
	accent_dark: '#BA5E20',
	accent_2: '#EEB52F',
	text_light: '#A1B1B3',
	text_dark: '#76898C',
	text_darker: '#323838'
};

const colorArrayA = [
	'hsl(310, 67%, 38%)',
	'hsl(296, 70%, 37%)',
	'hsl(285, 75%, 39%)',
	'hsl(275, 78%, 39%)',
	'hsl(265, 80%, 40%)',
	'hsl(255, 71%, 43%)',
	'hsl(245, 67%, 45%)',
	'hsl(234, 72%, 44%)',
	'hsl(223, 84%, 41%)',
	'hsl(215, 100%, 40%)',
	'hsl(210, 100%, 40%)',
	'hsl(203, 100%, 40%)',
	'hsl(196, 100%, 39%)'
];

const colorArrayB = [
	'hsl(196, 100%, 39%)',
	'hsl(182, 100%, 33%)',
	'hsl(165, 80%, 36%)',
	'hsl(135, 67%, 36%)',
	'hsl(102, 76%, 36%)',
	'hsl(82, 100%, 35%)',
	'hsl(66, 100%, 37%)',
	'hsl(57, 100%, 38%)',
	'hsl(48, 100%, 38%)',
	'hsl(38, 100%, 39%)',
	'hsl(27, 100%, 39%)',
	'hsl(17, 100%, 39%)',
	'hsl(5, 88%, 37%)'
];

const colorArrayC = [
	'hsl(203, 100%, 40%)',
	'hsl(196, 100%, 39%)',
	'hsl(182, 100%, 33%)',
	'hsl(165, 80%, 36%)',
	'hsl(135, 67%, 36%)',
	'hsl(102, 76%, 36%)',
	'hsl(82, 100%, 35%)',
	'hsl(66, 100%, 37%)',
	'hsl(57, 100%, 38%)',
	'hsl(48, 100%, 38%)',
	'hsl(38, 100%, 39%)',
	'hsl(27, 100%, 39%)',
	'hsl(17, 100%, 39%)',
	'hsl(5, 88%, 37%)',
	'hsl(345, 80%, 30%)',
	'hsl(327, 80%, 27%)'
];

const colorScaleA = chroma.scale(colorArrayA).mode('lab');
const colorScaleB = chroma.scale(colorArrayB).mode('lab');
const colorScaleC = chroma.scale(colorArrayC).mode('lab');

const humidityScale = chroma.scale([colorTheme.background_light, 'hsl(204, 69%, 53%)']).mode('lab');
const cloudScale = chroma.scale(['hsl(204, 0%, 60%)', 'hsl(204, 69%, 53%)']).mode('lab');

var getTemperatureColor = function(x) {
	var color;
	if (x < 0) {
		x = Helpers.remapValue(x, [-40, 0], [0, 1]);
		color = colorScaleA(x);
	} else {
		x = Helpers.remapValue(x, [0, 40], [0, 1]);
		color = colorScaleB(x);
	}
	return color.set('lab.l', '*1.025').set('lch.c', '*1.1');
}

var getPrecipitationColor = function(x) {
	const offset = 0.05;
	if (x < offset) {
		return colorTheme.background_light;
	} else {
		x = Helpers.clamp((x - offset) / 12, 0, 1);
		return colorScaleC(x).set('lab.l', '*1.025').set('lch.c', '*1.1');
	}
}

var getWindColor = function(x) {
	x = Helpers.remapValue(x, [0, 27], [0, 1]);
	return colorScaleC(x).set('lab.l', '*1.025').set('lch.c', '*1.1');
}

var getHumidityColor = function(x) {
	return humidityScale(x / 100);
}

var getCloudColor = function(x) {
	return cloudScale((100 - x) / 100);
}

export const Colors = {
	colorTheme,
	getTemperatureColor,
	getPrecipitationColor,
	getWindColor,
	getHumidityColor,
	getCloudColor
};
