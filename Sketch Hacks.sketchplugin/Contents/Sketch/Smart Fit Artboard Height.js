// Resizes the height of the artboard to fit all its layers

// Helper functions:

var artboardForObject = function(object) {
  if (object.isKindOfClass(MSArtboardGroup)) {
    return object;
  } else if (object.parentGroup() != null) {
    return artboardForObject(object.parentGroup());
  } else {
    return null;
  }
};


// Handlers:

var selectParentArtboards = function(context) {
  var selection = context.selection;
  var doc = context.document;
  var page = doc.currentPage();
  var artboards = page.artboards();

  var artboardsToSelect = [];
  var selectionLoop = selection.objectEnumerator();
  var object;
  while (object = selectionLoop.nextObject()) {
    var artboard = artboardForObject(object);
    if (artboard != null) {
      artboardsToSelect.push(artboard);
    }
  }
  page.deselectAllLayers();

  for (var i = 0; i < artboardsToSelect.length; i++) {
    var artboard = artboardsToSelect[i];
    artboard.select_byExpandingSelection(true, true);
  }

  return artboardsToSelect;
}


// Sort function, descending
function sortBottom(a, b) {
	return b.bottom - a.bottom;
}

var onRun = function (context) {
    var artboards = selectParentArtboards(context);

    // old school variable
    var doc = context.document;
    var selection = context.selection;

    for (var i = 0; i < artboards.length; i++) {
        if (artboards[i].className() == "MSArtboardGroup") {
            var artboard = artboards[i];

            // Store some meta data about all layers and their respective bottom position
            var meta = [];
            var layers = artboard.children();

            // Loop through all children of the artboard
            for (var j = 0; j < layers.count(); j++) {

                // Remember the current layer
                var layer = layers[j];

                if (layer !== undefined && layer.className() != "MSArtboardGroup") {

                    // Calculate the bottom edge position
                    var bottom = layer.frame().y() + layer.frame().height();
                    meta.push({
                        layer: layer,
                        bottom: bottom
                    });
                }
            }

            // Sort the layers by bottom position, descending
            meta.sort(sortBottom);

            // Finally set the height of the artboard
            artboard.frame().setHeight(meta[0].bottom)


        }
    }

    for ( var k = 0; k < selection.count(); k++ ) {
      selection.objectAtIndex(k).setIsSelected(true);
    }
}



