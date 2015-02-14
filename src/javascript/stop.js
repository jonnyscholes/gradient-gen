var hg = require('mercury');
var h = require('mercury').h;

module.exports = Stop;

function Stop(item) {
	item = item || {};
	return hg.state({
		color: hg.value(item.color || 'rgba(0,0,0,0.5)'),
		size: hg.value(item.size || 'auto'),
		channels: {
			editColor: function (state, data) {
				if(data.color) {
					state.color.set(data.color);
				}
			},
			editSize: function (state, data) {
				if(data.size) {
					state.size.set(data.size);
				}
			}
		}
	});
}

Stop.render = function(stop) {
	return h('li.stops--single', [
		h('input.stops--color.colorpicker', {
			value: stop.color,
			name: 'color',
			'ev-focus': function(){
				jsColorPicker('input.colorpicker', {
					customBG: '#222',
					size: 4,
					readOnly: true
				});
			},
			'ev-event': hg.sendSubmit(stop.channels.editColor),
			'ev-blur': hg.sendValue(stop.channels.editColor)
		}),
		h('input.stops--size', {
			value: stop.size,
			name: 'size',
			'ev-event': hg.sendSubmit(stop.channels.editSize),
			'ev-blur': hg.sendValue(stop.channels.editSize)
		})
	]);
};