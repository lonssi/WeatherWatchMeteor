import chroma from 'chroma-js';
import {Helpers} from './helpers.js';


const colorThemeDark = {
	id: 'dark',
	name: 'Dark',
	bg: {
		light: '#485865',
		dark: '#3E4B57',
		darker: '#37434C',
		clock: '#FFFFFF',
		empty: '#646B71'
	},
	accent: {
		light: '#E6944C',
		dark: '#BA5E20'
	},
	text: {
		light: '#A1B1B3',
		dark: '#76898C',
		data: '#212121'
	},
	misc: {
		menu: '#3E4B57',
		clock: '#3E4B57',
		border: '#323838',
		hint: '#76898C',
		down: '#37434C'
	},
	static: {
		moon_bright_up: '#A1B1B3',
		moon_bright_down: '#485865',
		moon_dark: '#37434C'
	}
};

const colorThemeLight = {
	id: 'light',
	name: 'Light',
	bg: {
		light: '#FFFFFF',
		dark: '#EAEAEA',
		darker: '#CBCBCB',
		clock: '#FFFFFF',
		empty: '#D1D1D1'
	},
	accent: {
		light: '#6A859A',
		dark: '#54697A'
	},
	text: {
		light: '#363636',
		dark: '#777777',
		data: '#212121'
	},
	misc: {
		menu: '#FFFFFF',
		clock: '#3E4B57',
		border: '#DFDFDF',
		hint: '#B2B2B2',
		down: '#54697A',
	},
	static: {
		moon_bright_up: '#A1B1B3',
		moon_bright_down: '#4D5D6B',
		moon_dark: '#3E4C56'
	}
};

const colorThemes = [
	colorThemeDark,
	colorThemeLight
];

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
	'hsl(27, 100%, 41%)',
	'hsl(17, 100%, 42%)',
	'hsl(5, 80%, 43%)'
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
	'hsl(27, 100%, 41%)',
	'hsl(17, 100%, 42%)',
	'hsl(5, 80%, 43%)',
	'hsl(345, 80%, 38%)',
	'hsl(327, 80%, 37%)'
];

const colorScaleA = chroma.scale(colorArrayA).mode('lab');
const colorScaleB = chroma.scale(colorArrayB).mode('lab');
const colorScaleC = chroma.scale(colorArrayC).mode('lab');

const humidityScale = chroma.scale(['hsl(45, 85%, 51%)', 'hsl(204, 69%, 53%)']).mode('lab');
const cloudScale = chroma.scale(['hsl(204, 0%, 67%)', 'hsl(204, 69%, 53%)']).mode('lab');

var getTemperatureColor = function(x) {
	var color;
	if (x < 0) {
		x = Helpers.remapValue(x, [-40, 0], [0, 1]);
		color = colorScaleA(x);
	} else {
		x = Helpers.remapValue(x, [0, 40], [0, 1]);
		color = colorScaleB(x);
	}
	return color.set('lab.l', '*1.275').set('lch.c', '*1.1');
};

var getPrecipitationColor = function(x) {
	const offset = 0.05;
	if (x < offset) {
		return null;
	} else {
		x = Helpers.clamp((x - offset) / 12, 0, 1);
		return colorScaleC(x).set('lab.l', '*1.275').set('lch.c', '*1.1');
	}
};

var getWindColor = function(x) {
	x = Helpers.remapValue(x, [0, 27], [0, 1]);
	return colorScaleC(x).set('lab.l', '*1.275').set('lch.c', '*1.1');
};

var getHumidityColor = function(x) {
	x = x / 100;
	x = -Math.pow(x - 1, 2) + 1;
	return humidityScale(x).set('lab.l', '*1.1');
};

var getCloudColor = function(x) {
	return (cloudScale((100 - x) / 100)).set('lab.l', '*1.1');
};

var getColorTheme = function(theme, hue) {

	hue = hue * 360;

	const themeNew = JSON.parse(JSON.stringify(theme));
	const hueString = (hue >= 0) ? "+" + hue.toString() : hue.toString();

	for (var key in themeNew) {

		if (key === "static" || key === "id" || key === "name") {
			continue;
		}

		const category = themeNew[key];

		for (var cKey in category) {
			const color = category[cKey];
			const colorNew = chroma(color).set('hsl.h', hueString);
			category[cKey] = colorNew.hex();
		}
	}

	return themeNew;
};

export const Colors = {
	getTemperatureColor,
	getPrecipitationColor,
	getWindColor,
	getHumidityColor,
	getCloudColor,
	getColorThemes: function() { return colorThemes; },
	getColorTheme
};
