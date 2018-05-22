// Sets the font size of selected text fields + optional line height



var onRun = function (context) {

    function parseSizeValues(userInput) {
        var result = {};
        var pieces = userInput.split('/');
        if (pieces[0] === '' ) {
            result.fontSize = -1;
        } else {
            result.fontSize = parseInt(pieces[0]);
        }
        if (pieces[1] !== undefined ) {
            result.lineHeight = parseInt(pieces[1]);
        }
        return result;
    }

    // old school variable
    doc = context.document;
    selection = context.selection;

    var textLayers = [];

    if (selection.count() > 0) {


        // Loop through selected layers
        for (var i = 0; i < selection.count(); i++) {

            var s = selection[i];

            // Check if the layer is a text layer
            if (s.className() == "MSTextLayer"){
                textLayers.push(s);
            }
        }

        if (textLayers.length > 0) {

            // get first text layer
            var firstTextLayer = textLayers[0];

            // Calculate initial line height
            var fontSize = firstTextLayer.fontSize();
            var lineHeight = firstTextLayer.lineHeight();
            var multiple = (lineHeight / fontSize).toFixed(1);

            // Show a dialog, asking for the line height multiple
            var newSize = parseSizeValues([doc askForUserInput:"Font size:" initialValue:"12/14"]);

            for (var j = 0; j < textLayers.length; j++) {

                var textLayer = textLayers[j];

                // Calculate the line height based on the font size and multiple
                if ( fontSize !== -1 ) {
                    var fontSize = newSize.fontSize;
                }
                textLayer.setFontSize(fontSize);
                
                if (newSize.lineHeight !== undefined ) {
                    var lineHeight = newSize.lineHeight;
                    textLayer.setLineHeight(lineHeight);
                }
            }
            
            context.document.reloadInspector();
        } else {
            doc.showMessage("Please select a text layer.");
        }
    } else {
        doc.showMessage("Please select a text layer.")
    }

}