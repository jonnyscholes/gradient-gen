var BaseEvent = require('mercury').BaseEvent;
var Delegator = require('mercury').Delegator

var delegator = Delegator()
delegator.listenTo('dragstart')
delegator.listenTo('dragend')
delegator.listenTo('dragover')
delegator.listenTo('dragenter')
delegator.listenTo('dragleave')
delegator.listenTo('drop')

module.exports = BaseEvent(function (ev, broadcast) {
	broadcast({
		data: this.data,
		dataTransfer: ev._rawEvent.dataTransfer,
		originalEvent: ev
	});
});