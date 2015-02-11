var hg = require('mercury');
var h = require('mercury').h;
var computed = require('mercury').computed;
var cuid = require('cuid');

var WeakmapEvent = require('./libs/weakmap-event.js');
var DataTransfer = require('./libs/data-transfer.js');

var Stop = require('./stop.js');

var onSwap = WeakmapEvent();
var onDelete = WeakmapEvent();

Gradient.onSwap = onSwap.listen;
Gradient.onDelete = onDelete.listen;

module.exports = Gradient;

function Gradient(item) {
	item = item || {};
	return hg.state({
		id: hg.value(item.id || cuid()),
		stops: hg.array(item.stops || []),
		type: hg.value(item.type || 'linear'),
		isTarget: hg.value(false),
		channels: {
			addStop: Gradient.addStop,
			sendDelete: Gradient.sendDelete,
			updateType: Gradient.updateType,
			handleDragstart: handleDragstart,
			handleDrop: handleDrop,
			handleDragover: handleDragover,
			handleEnter: handleEnter,
			handleLeave: handleLeave
		}
	});
}

Gradient.addStop = function addStop(state, data) {
	state.stops.push(Stop());
};

Gradient.updateType = function updateType(state, data) {
	state.type.set(data.type);
};

Gradient.sendDelete = function addStop(state, data) {
	onDelete.broadcast(state, {
		id: state.id()
	});
};

Gradient.render = function (gradient) {
	return h('div', {
		className: gradient.isTarget ? 'layer is-target' : 'layer',
		draggable: true,
		'ev-dragstart': DataTransfer(gradient.channels.handleDragstart, gradient),
		'ev-dragenter': DataTransfer(gradient.channels.handleEnter, gradient),
		'ev-dragleave': DataTransfer(gradient.channels.handleLeave, gradient),
		'ev-dragover': DataTransfer(gradient.channels.handleDragover, gradient),
		'ev-drop': DataTransfer(gradient.channels.handleDrop, gradient)
	}, [
		h('div.layer--settings', [
			h('div.layer--title', ['Settings']),
			h('select',
				{
					name: 'type',
					'ev-event': hg.changeEvent(gradient.channels.updateType)
				},
				[h('option',
					{
						selected: gradient.type === 'linear',
						value: 'linear'
					}, 'linear'),
				h('option',
					{
						selected: gradient.type === 'radial',
						value: 'radial'
					}, 'radial')]
			)
		]),
		h('div.layer--title', ['Color stops']),
		h('ul.stops', gradient.stops.map(Stop.render)),
		h('div.layer--menu', [
			h('a.icon-add', {
				href: '#',
				'ev-click': hg.send(gradient.channels.addStop)
			}),
			h('a.icon-close', {
				href: '#',
				'ev-click': hg.send(gradient.channels.sendDelete)
			})
		])
	]);
};


// Draggable helpers
function handleDragstart(state, ev) {
	ev.dataTransfer.effectAllowed = 'move';
	ev.dataTransfer.setData('text/html', ev.originalEvent.currentTarget.innerHTML);

	window.srcDragElementIndex = state.id();
}

function handleDragover(state, ev) {
	ev.originalEvent._rawEvent.preventDefault();
	return false;
}

function handleEnter(state, ev) {
	state.isTarget.set(true);
}

function handleLeave(state, ev) {
	state.isTarget.set(false);
}

function handleDrop(state, ev) {
	state.isTarget.set(false);

	onSwap.broadcast(state, {
		dragSrc: window.srcDragElementIndex,
		dragTarget: state.id()
	});

	if (ev.originalEvent.stopPropagation) {
		ev.originalEvent.stopPropagation();
	}

	return false;
}

