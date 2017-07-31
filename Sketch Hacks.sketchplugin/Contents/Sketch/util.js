// set up namespace
var com = com || {};
com.timdose = {}


var getBaseline = function (fontSize, lineHeight) {
	if (lineHeight == 0 ) {
		return Math.round(fontSize*.75);
	}
	return Math.ceil((fontSize + lineHeight)/2);
}

com.timdose.sketch = {
	sendAction: function (commandToPerform) {
	    try {
	        [NSApp sendAction:commandToPerform to:nil from:com.timdose.doc];
	    } catch(e) {
	        log(e)
	    }
	}
}

com.timdose.arrange = {
	sendToBack: function () {
	    com.timdose.sketch.sendAction('moveToBack:');
	},
	sendBackward: function () {
	    com.timdose.sketch.sendAction('moveBackward:');
	},
	sendToFront: function () {
	    com.timdose.sketch.sendAction('moveToFront:');
	},
	sendForward: function () {
	  com.timdose.sketch.sendAction('moveForward:');
	},
}

com.timdose.selection = {
	deselectAll: function (page) {
		if (MSApplicationMetadata.metadata().appVersion < 45) {
		    page.deselectAllLayers();
		} else {
		    page.changeSelectionBySelectingLayers_([]);
		}
	},

	expandSelectionWithLayer: function(layer) {
		if (MSApplicationMetadata.metadata().appVersion > 45) {
		    layer.select_byExpandingSelection(true, true);
		} else {
		    layer.select_byExtendingSelection(true, true);
		}
	}
}

var exports = typeof exports === 'undefined'? this['mymodule']={} : exports;

exports.getBaseline = getBaseline;
