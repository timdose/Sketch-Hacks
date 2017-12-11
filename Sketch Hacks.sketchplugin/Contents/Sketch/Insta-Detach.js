var onRun = function( context ) {
	context.document.showMessage('Insta-Detach run');
}


var onInsertSymbolComplete = function( context ) {
	return;
	if ( context.actionContext.name == 'InsertSymbol' ) {
		log( '\n\n\n----------------------------------------')
		log( 'symbol placed');
		log( '\n\ncontext\n--------------------\n' );
		log( context );
		log( '\n\ncontext.api\n--------------------\n' );
		log( context.api() );
		log( '\n\ncontext.api().selectedDocument\n--------------------\n' );
		log( context.api().selectedDocument );
		log( '\n\ncontext.api().selectedDocument.selectedLayers\n--------------------\n' );
		log( context.api().selectedDocument.selectedLayers );
	}
}

var onLayersMoved = function( context ) {
	return;
	context.actionContext.document.showMessage('Layers moved!');
}

var onAction = function( context ) {
	return;
	log( '\n\naction triggered' );
	log( context );
	log( context.actionContext.name );

	if ( context.actionContext.name == 'InsertSymbol' ) {
		log( '*********PLACED?!?!');
	}
}