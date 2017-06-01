
function selectChildren(item) {
    var layers = [item layers]
    for (var x=0; x < [layers count]; x++){
        var childLayer = layers[x];
        [childLayer select:true byExpandingSelection:true]
    }
}

var onRun = function (context) {

    // old school variable
    doc = context.document;
    selection = context.selection;

    var firstItem = selection[0]


    // if ( firstItem.className() != "MSArtboardGroup" ) {
    //     doc.showMessage('Please select an artboard')
    //     return;
    // }

    selectChildren(firstItem);

    


}




// // Select all child layers of a group (cmd alt A)

// function is_group(layer) {
//   return [layer isMemberOfClass:[MSLayerGroup class]] || [layer isMemberOfClass:[MSArtboardGroup class]]
// }

// function selectChildren(layers) {
//   for (var x=0; x < [layers count]; x++){
//     var childLayer = layers.array()[x];
//     [childLayer select:true byExpandingSelection:true]
//   }
// }

// for (var i=0; i < [selection count]; i++){
//   var layer = selection[i];

//   if (is_group(layer)) {
//     [layer select:false byExpandingSelection:true]

//     selectChildren([layer layers]);
//   } else {
//     var parentGroup = [layer parentGroup];
//     selectChildren([parentGroup layers]);;
//   }
// }