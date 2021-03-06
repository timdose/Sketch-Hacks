@import 'util.js';

var expandSelectionWithLayer = com.timdose.selection.expandSelectionWithLayer;

var onRun = function(context) {

  var doc = context.document;
  var selection = context.selection[0];

  // set the scope to the layer group that the currently selected layer is in
  var scope = selection.parentGroup().layers()//.array();

  // calculate the bottom position of the selected layer
  // var bottom = selection.absoluteRect().y() + selection.absoluteRect().height();
  var bottom = selection.absoluteRect().y();

  // set up the predicate and receive an array of matched layers
  var predicate = NSPredicate.predicateWithFormat("absoluteRect.y >= %@", bottom);
  var queryResult = scope.filteredArrayUsingPredicate(predicate);

  // select all layers that match the query
  // doc.currentPage().selectLayers(queryResult);
  // selection.setIsSelected(true);

  for ( var i = 0; i < queryResult.count(); i++ ) {
    expandSelectionWithLayer(queryResult.objectAtIndex(i));
  }
};