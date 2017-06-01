// Sets the font size of selected text fields + optional line height



var onRun = function (context) {


    // old school variable
    doc = context.document;
    selection = context.selection;

    var selectedLayers = [];

    if (selection.count() > 0) {


        if (selectedLayers.length > 0) {



            // Show a dialog, asking for the line height multiple
            var delta = parseFloat([doc askForUserInput:"How far?:" initialValue:"100"]);

            for (var j = 0; j < selectedLayers.length; j++) {

                var currentLayer = selectedLayers[j];

                currentX = layer.frame().x();
                
                currentLayer.frame().setX(currentX + delta);

            }

        } else {
            doc.showMessage("Please at least one layer or artboard.");
        }
    } else {
        doc.showMessage("Please at least one layer or artboard.")
    }

}