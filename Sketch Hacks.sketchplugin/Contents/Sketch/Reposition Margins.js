@import 'util.js';

var deselectAll = com.timdose.selection.deselectAll;
var expandSelectionWithLayer = com.timdose.selection.expandSelectionWithLayer;

const TOP_MARGIN_NAMES =    ['*marginTop',    '*topMargin',    '*margin-top',    '*top-margin',    '*borderTop',    '*topBorder',    '*border-top',    '*top-border'];
const BOTTOM_MARGIN_NAMES = ['*marginBottom', '*bottomMargin', '*margin-bottom', '*bottom-margin', '*borderBottom', '*bottomBorder', '*border-bottom', '*bottom-border'];
const BACKGROUND_NAMES = ['*bg', '*background'];
const ALL_NAMES = BOTTOM_MARGIN_NAMES.concat(TOP_MARGIN_NAMES).concat(BACKGROUND_NAMES);

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
        for ( var j = 0; j < ALL_NAMES.length; j++ ) {
            if ( layer.name() == ALL_NAMES[j] ) {
                notMargin = false;
            }
        }

        if ( notMargin ) {
            layers.push(layer);
        }
        
    }
    return layers;
}

function getSpecialLayers(group, type) {
    if ( type === undefined ) {
        type = 'bottom';
    }

    var specialNames;

    if ( type == 'bottom' ) {
        specialNames = BOTTOM_MARGIN_NAMES;
    } else if ( type == 'top' ) {
        specialNames = TOP_MARGIN_NAMES;
    } else if ( type == 'background' ) {
        specialNames = BACKGROUND_NAMES;
    }
    for (var i = 0; i < group.layers().count(); i++) {
        // group.layers().objectAtIndex(i).setIsSelected(true);
        var layer = group.layers().objectAtIndex(i);

        for ( var j = 0; j < specialNames.length; j++ ) {
            var acceptableMarginName = specialNames[j];
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
    var marginBottom = getSpecialLayers(parentGroup, 'bottom' );
    var marginTop = getSpecialLayers(parentGroup, 'top' );
    var bg = getSpecialLayers(parentGroup,'background');

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

    var contentTop = meta[meta.length-1].top;
    var contentBottom = meta[0].bottom;
    var contentHeight = contentBottom - contentTop;
    var globalTop = contentTop;
    var globalBottom = contentBottom;
    var globalHeight = contentHeight;

    var marginBottomOffset;

    if (marginTop !== undefined ) {
        var marginTopHeight = marginTop.frame().height();
        globalTop = contentTop - marginTopHeight;
        globalHeight += marginTopHeight;
    }
    
    if (marginBottom !== undefined ) {
        var marginBottomHeight = marginBottom.frame().height();
        marginBottomOffset = contentBottom;
        globalBottom = contentBottom + marginBottomHeight;
    }
    
    if ( marginTop ) {
        marginTop.frame().setTop(globalTop);
        marginTop.select_byExtendingSelection(true, false);
        // Move to front
        NSApp.sendAction_to_from("moveToFront:", nil, doc);
    }

    if ( marginBottom ) {
        marginBottom.frame().setTop(marginBottomOffset)
        
        // Move to back
        marginBottom.select_byExtendingSelection(true, false);
        NSApp.sendAction_to_from("moveToBack:", nil, doc);

        // add the height of the bottom margin to the total height
        globalHeight += marginBottom.frame().height();
    }

    if ( bg ) {
        bg.frame().setTop(globalTop);
        bg.frame().setHeight(globalHeight);
        bg.select_byExtendingSelection(true, false);
        NSApp.sendAction_to_from("moveToBack:", nil, doc);
    }
    
    parentGroup.resizeToFitChildrenWithOption(0);        

    // reselect original selection
    deselectAll(doc.currentPage());
    for ( var i = 0; i < selection.count(); i++ ) {
        expandSelectionWithLayer(selection.objectAtIndex(i) );        
    }

}