var onRun = function( context ) {
	context.document.showMessage('Annotation.js run');
}


var onLayersMoved = function( context ) {
	// log('layers moved');
	// log(context.actionContext);
	// repositionNotes( context );
	
}

function repositionNotes( context ) {
	var layers = context.actionContext.layers;


	for (var i = 0; i < layers.count(); i++) {
	    if ( layers[i].name() == 'followme' ) {
	        
	        var note = getNote(context.actionContext.document)
	        log("NOTE:" + note );
	        var newX = layers[i].frame().x();
	        var newY = layers[i].frame().y();
	        var offsetX = layers[i].frame().width();
	        note.frame().setLeft(newX - offsetX);
	        note.frame().setTop(newY);
	    }
	}
}


function getNote( document ) {
	var currentPage = [document currentPage];
	log( 'currentPage: ' + currentPage ) ;

	var layers = currentPage.layers();
	for (var i = 0; i < layers.count(); i++) {
	    var sublayer = layers.objectAtIndex(i);
	    if ( sublayer.name() == '*note' ) {
	    	return sublayer;
	    }
	}
}