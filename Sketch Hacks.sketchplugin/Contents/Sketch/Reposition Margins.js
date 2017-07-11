@import 'util.js';

var deselectAll = com.timdose.selection.deselectAll;
var expandSelectionWithLayer = com.timdose.selection.expandSelectionWithLayer;

const BOTTOM_MARGIN_NAMES = ['*margin', '*marginBottom', '*bottomMargin', '*margin-bottom', '*bottom-margin'];
const TOP_MARGIN_NAMES = ['*marginTop', '*topMargin', '*margin-top', '*top-margin'];
const ALL_MARGIN_NAMES = BOTTOM_MARGIN_NAMES.concat(TOP_MARGIN_NAMES);

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


function getNonMarginLayersInGroup(group) {
    var layers = [];
    for (var i = 0; i < group.layers().count(); i++) {
        // group.layers().objectAtIndex(i).setIsSelected(true);
        var layer = group.layers().objectAtIndex(i);
        var notMargin = true;
        for ( var j = 0; j < ALL_MARGIN_NAMES.length; j++ ) {
            if ( layer.name() == ALL_MARGIN_NAMES[j] ) {
                notMargin = false;
            }
        }

        if ( notMargin ) {
            layers.push(layer);
        }
        
    }
    return layers;
}

function getMargin(group, type) {
    if ( type === undefined ) {
        type = 'bottom';
    }

    var marginNames;

    if ( type == 'bottom' ) {
        marginNames = BOTTOM_MARGIN_NAMES;
    } else {
        marginNames = TOP_MARGIN_NAMES;
    }
    for (var i = 0; i < group.layers().count(); i++) {
        // group.layers().objectAtIndex(i).setIsSelected(true);
        var layer = group.layers().objectAtIndex(i);

        for ( var j = 0; j < marginNames.length; j++ ) {
            var acceptableMarginName = marginNames[j];
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

    var layers = getNonMarginLayersInGroup(parentGroup);
    var marginBottom = getMargin(parentGroup, 'bottom' );
    var marginTop = getMargin(parentGroup, 'top' );

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
                var top = layer.frame().y();
                meta.push({
                    layer: layer,
                    bottom: bottom,
                    top: top
                });
            }
        }

        // Sort the layers by bottom position, descending
        meta.sort(sortBottom);

    }

    var marginTopOffset = meta[meta.length-1].top - marginTop.frame().height();
    marginTop.frame().setTop(marginTopOffset)

    var marginBottomOffset = meta[0].bottom;
    marginBottom.frame().setTop(marginBottomOffset)
    parentGroup.resizeToFitChildrenWithOption(0);

    // reselect original selection
    deselectAll(doc.currentPage());
    for ( var i = 0; i < selection.count(); i++ ) {
        expandSelectionWithLayer(selection.objectAtIndex(i) );        
    }

}