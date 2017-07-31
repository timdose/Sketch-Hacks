@import 'util.js';

var onRun = function (context) {

	var doc = context.document;

	var start = {x:20, y:50.5};
	var length = 50;
	const COLOR_STRING = "#2BBFED";
	const DASH_PATTERN = [1,2,1,2];
	var command = context.command;


	var artboardForObject = function(object) {
	  if (object.isKindOfClass(MSArtboardGroup)) {
	    return object;
	  } else if (object.parentGroup() != null) {
	    return artboardForObject(object.parentGroup());
	  } else {
	    return null;
	  }
	};


	function createGroup( layers ) {
		if (layers.length === 0 ) {
			return false;
		}

		var groupObject = MSLayerGroup.new();
		var targetGroup = layers[0].parentGroup();
		targetGroup.addLayers([groupObject]);
		groupObject.setName('link');

		for ( var i = 0; i < layers.length; i++ ) {
			var layer = layers[i];
			var parent = layer.parentGroup();
			parent.removeLayer(layer);
			groupObject.addLayers([layer]);
		}

		groupObject.resizeToFitChildrenWithOption(1);
	}

	function getFillColor(layer) {
	    if (layer.class() == "MSShapeGroup") {
	        var fills = layer.style().enabledFills();
	        if (fills.count() > 0) {
	            if (fills.lastObject().fillType() == 0) {
	                return fills.lastObject().color();
	            } else {
	                return null;
	            }
	        } else {
	            return null;
	        }
	    }
	    if (layer.class() == "MSTextLayer") {
	        return layer.textColor();
	    }
	}

	function createLine(from, to, color, dashPattern ){
		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(from.x,from.y));
		path.lineToPoint(NSMakePoint(to.x,to.y));

		var shape = MSShapeGroup.shapeWithBezierPath(path);
		var border = shape.style().addStylePartOfType(1);
		// border.color = MSImmutableColor.colorWithSVGString(colorString).newMutableCounterpart()
		border.color = color;
		border.thickness = 1;

		if ( dashPattern !== undefined ) {
			shape.style().borderOptions().dashPattern = dashPattern;
		}
		return shape
	}

	function createHorizontalLine(start, length, color, dashPattern ) {
		return createLine(start, {x: start.x + length, y:start.y}, color, dashPattern );
	}

	function findSiblingByName(sourceLayer, name) {
		var siblings = sourceLayer.parentGroup().layers();
		for (var i = 0; i < siblings.count(); i++ ) {
			var sibling = siblings.objectAtIndex(i)
			if ( sibling.name() == name ) {
				return sibling;
			}
		}
	}

	function createLinkUnderline(doc, layers) {
		for (var i = 0; i < layers.count(); i++) {
			var layer = layers.objectAtIndex(i);

			var existingUnderline = findSiblingByName(layer, '*underline');
			if (existingUnderline !== undefined ) {
				existingUnderline.removeFromParent();		
			}

			if (layer.className() == 'MSTextLayer' ) {
				// var baselineShift = Math.floor(layer.lineHeight()/2) + layer.fontSize();
				// var baselineShift = 0;
				var lineHeight = layer.lineHeight();
				var fontSize = layer.fontSize();

				var offset = getBaseline(fontSize, lineHeight) + .5 + 3;

				log( 'fontSize: ' + fontSize );
				log( 'lineHeight: ' + lineHeight );
				log( 'offset: ' + offset );
				// var baselineShift = lineHeight;

				// var start = {x:layer.absoluteRect().rulerX(), y:layer.absoluteRect().rulerY()-.5+baselineShift}
				var start = {x:layer.frame().x(), y:layer.frame().y()+offset}
				var length = layer.frame().width();
				var color = getFillColor(layer);
				var shape = createHorizontalLine(start, length, color, DASH_PATTERN)
				// var artboard = artboardForObject(layer);
				layer.parentGroup().addLayers([shape]);
			}
			// layer.setIsSelected(false);
			// shape.setIsSelected(true);
			shape.setName('*underline');
			if ( existingUnderline === undefined ) {
				createGroup([shape,layer])
			} else {
				com.timdose.arrange.sendToFront();
			}
			// shape.
		}
	}

	function getSelectedLayers(context, onlyLayersOfType) {
		var selection = context.selection;

		if (selection.count() == 0) {
		    context.document.showMessage("Please select at least one layer.");
		    return false;
		}

		return selection;
	}

	var selectedLayers = getSelectedLayers(context);

	if (selectedLayers !== false ) {
		createLinkUnderline(doc, selectedLayers);
	}

	// var shape = createHorizontalLine(start, length, COLOR_STRING, DASH_PATTERN)
	// doc.currentPage().addLayers([shape]);

}
//"MSTextLayer"