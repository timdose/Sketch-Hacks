var onRun = function (context) {

	var doc = context.document;

	var start = {x:20, y:50.5};
	var length = 50;
	const COLOR_STRING = "#2BBFED";
	const DASH_PATTERN = [1,2,1,2];

	var artboardForObject = function(object) {
	  if (object.isKindOfClass(MSArtboardGroup)) {
	    return object;
	  } else if (object.parentGroup() != null) {
	    return artboardForObject(object.parentGroup());
	  } else {
	    return null;
	  }
	};

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

	function createLinkUnderline(doc, layers) {
		for (var i = 0; i < layers.count(); i++) {
			var layer = layers.objectAtIndex(i);

			if (layer.className() == 'MSTextLayer' ) {
				var baselineShift = Math.floor(layer.lineHeight()/2) + layer.fontSize();
				var start = {x:layer.absoluteRect().rulerX(), y:layer.absoluteRect().rulerY()-.5+baselineShift}
				var length = layer.frame().width();
				var color = getFillColor(layer);
				var shape = createHorizontalLine(start, length, color, DASH_PATTERN)
				var artboard = artboardForObject(layer);
				artboard.addLayers([shape]);
			}
			layer.setIsSelected(false);
			shape.setIsSelected(true);
			shape.setName('underline');
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