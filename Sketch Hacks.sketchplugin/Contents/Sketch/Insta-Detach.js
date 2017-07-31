var onRun = function( context ) {
	context.document.showMessage('Insta-Detach run');
}


var onInsertSymbolComplete = function( context ) {
	context.actionContext.document.showMessage('Symbol inserted!');
}

var onLayersMoved = function( context ) {
	context.actionContext.document.showMessage('Layers moved!');
}