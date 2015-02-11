var hg = require('mercury');
var h = require('mercury').h;

module.exports = Stop;

function Stop(item) {
	item = item || {};
	return hg.state({
		color: hg.value(item.color || 'rgba(0,0,0,0.5)'),
		channels: {
			finishEdit: function (state, data) {
				if(data.color) {
					state.color.set(data.color);
				}
			}
		}
	});
}

Stop.render = function(stop) {
	return h('li.stops--single', [
		h('input.colorpicker', {
			value: stop.color,
			name: 'color',
			'ev-focus': function(){
				jsColorPicker('input.colorpicker', {
					customBG: '#222',
					size: 4,
					readOnly: true
				});
			},
			'ev-event': hg.sendSubmit(stop.channels.finishEdit),
			'ev-blur': hg.sendValue(stop.channels.finishEdit)
		})
	]);
};