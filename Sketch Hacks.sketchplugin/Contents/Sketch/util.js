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
	        // [NSApp sendAction:commandToPerform to:nil from:com.timdose.doc];
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

com.timdose.text = {
	incrementLineHeight: function(context, increment) {
		var doc = context.document;
		var selection = context.selection;

		var textLayers = [];
	
		if (selection.count() > 0) {
	
	
			// Loop through selected layers
			for (var i = 0; i < selection.count(); i++) {
	
				var s = selection[i];
	
				// Check if the layer is a text layer
				if (s.className() == "MSTextLayer"){
					textLayers.push(s);
				}
			}
	
			if (textLayers.length > 0) {
				for (var j = 0; j < textLayers.length; j++) {
					
					var textLayer = textLayers[j];
					var lineHeight = textLayer.lineHeight();
					if ( lineHeight > 1 ) {
						textLayer.setLineHeight(lineHeight+increment);
					}
				}
				
				context.document.reloadInspector();
			} else {
				doc.showMessage("Please select a text layer.");
			}
		} else {
			doc.showMessage("Please select a text layer.")
		}
	}
}

var exports = typeof exports === 'undefined'? this['mymodule']={} : exports;

exports.getBaseline = getBaseline;
exports.incrementLineHeight = com.timdose.text.incrementLineHeight;
