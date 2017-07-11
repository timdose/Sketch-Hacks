@import 'util.js';

var deselectAll = com.timdose.selection.deselectAll;
var expandSelectionWithLayer = com.timdose.selection.expandSelectionWithLayer;

const ACCEPTABLE_MARGIN_NAMES = ['*margin', '*marginBottom', '*bottomMargin']

function getParentGroup(context) {
    doc = context.document;
    selection = context.selection;

    if (selection.count() > 0) {
        var parent = selection[0].parentGroup();
        if (parent.className() != "MSPage") {
            deselectAll(doc.currentPage());
            // parent.setIsSelected(true)
            return parent;
        }
    } else {
        doc.showMessage("Please select a layer.");
    }
}


function getLayersInGroup(group) {
    var layers = [];
    for (var i = 0; i < group.layers().count(); i++) {
        // group.layers().objectAtIndex(i).setIsSelected(true);
        var layer = group.layers().objectAtIndex(i);
        var notMargin = true;
        for ( var j = 0; j < ACCEPTABLE_MARGIN_NAMES.length; j++ ) {
            if ( layer.name() == ACCEPTABLE_MARGIN_NAMES[j] ) {
                notMargin = false;
            }
        }

        if ( notMargin ) {
            layers.push(layer);
        }
        
    }
    return layers;
}

function getMargin(group) {
    for (var i = 0; i < group.layers().count(); i++) {
        // group.layers().objectAtIndex(i).setIsSelected(true);
        var layer = group.layers().objectAtIndex(i);

        for ( var j = 0; j < ACCEPTABLE_MARGIN_NAMES.length; j++ ) {
            var acceptableMarginName = ACCEPTABLE_MARGIN_NAMES[j];
            if ( layer.name() == acceptableMarginName ) {
                return layer;
            }
        }

        
    }
}

// Sort function, descending
function sortBottom(a, b) {
	return b.bottom - a.bottom;
}

var onRun = function (context) {
    var parentGroup = getParentGroup(context);

    var layers = getLayersInGroup(parentGroup);
    var margin = getMargin(parentGroup);
    

    // old school variable
    var doc = context.document;
    var selection = context.selection;
    var meta = [];

    for (var i = 0; i < layers.length; i++) {

        // Store some meta data about all layers and their respective bottom position

        // Loop through all children of the artboard
        for (var j = 0; j < layers.length; j++) {

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
    }

    margin.frame().setTop(meta[0].bottom)
    expandSelectionWithLayer(margin);

}