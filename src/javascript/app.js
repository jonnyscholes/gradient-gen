var hg = require('mercury');
var h = require('mercury').h;
var jscolordeps = require('colorpickerdeps');
var jscolor = require('colorpicker');

var Gradient = require('./gradient.js');

function GradientApp() {
	return hg.state({
		gradients: hg.varhash([]),
		isHidden: hg.value(false),
		channels: {
			addGradient: GradientApp.addGradient,
			toggle: GradientApp.toggle
		}
	});
}

GradientApp.addGradient = function (state) {
	var g = Gradient();
	state.gradients.put(g.id(), g);

	Gradient.onSwap(g, onSwap);
	Gradient.onDelete(g, onDelete);


	function onSwap(opts) {
		var tmp = state.gradients.get(opts.dragSrc);
		state.gradients.put(opts.dragSrc, state.gradients.get(opts.dragTarget));
		state.gradients.put(opts.dragTarget, tmp);
	}

	function onDelete(opts) {
		state.gradients.delete(opts.id);
	}
};

GradientApp.toggle = function (state) {
	state.isHidden.set(!state.isHidden());
};

GradientApp.render = function render(state) {
	var gradientList = objectToArray(state.gradients);
	var gradientString = gradientList.map(cssifyGradient).join(',');
	var rootClasses = '';

	if (state.isHidden) {
		rootClasses += 'is-hidden';
	}

	return h('div', {className: 'page ' + rootClasses}, [
		h('div.main', [
			h('div.main--menu', [
				h('a.icon-add', {
					href: '#',
					'ev-click': hg.send(state.channels.addGradient)
				}),
				h('a', {
					className: state.isHidden ? 'icon-hide' : 'icon-show',
					href: '#',
					'ev-click': hg.send(state.channels.toggle)
				})
			]),
			h('div.editors', gradientList.map(function renderGradientSingle(gradient) {
				return Gradient.render(gradient);
			}))
		]),
		h('div.gradient', {
			'style': {
				'background': gradientString
			}
		})
	]);
};

function cssifyGradient(gradient) {
	return gradient.type === 'linear' ? buildLinearGradient(gradient.stops) : buildRadialGradient(gradient.stops);
}

function buildRadialGradient(stops) {
	return 'radial-gradient( circle at center,' + stops.map(function (o) {
			return o.color;
		}).join(',') + ')';
}

function buildLinearGradient(stops) {
	return 'linear-gradient( to right,' + stops.map(function (o) {
			return o.color + ' ' + o.size;
		}).join(',') + ')';
}

function objectToArray(obj) {
	return Object.keys(obj).map(function toItem(k) {
		return obj[k];
	});
}

function main() {
	hg.app(document.body, GradientApp(), GradientApp.render);
}

main();