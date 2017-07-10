@import 'MochaJSDelegate.js';

function mouseInCanvasViewForDocument(document) {
    // var mouseInWindow = document.documentWindow().convertScreenToBase(NSEvent.mouseLocation());
    var mouseInWindow = document.documentWindow().convertScreenToBase(NSEvent.mouseLocation());
    return document.currentView().convertPoint_fromView(mouseInWindow,null);    
}

var onRun = function(context) {
	var hud;

	// var doc = updateContext().doc;
	var doc = context.document;

	doc.showMessage('heads up start');


	var threadDictionary = NSThread.mainThread().threadDictionary();
	var identifier = "com.timdose.sketch.util.headsup";
	// return;
	if (threadDictionary[identifier]) {
	    doc.showMessage('already open! closing...');
	    hud = threadDictionary[identifier]
	    closeHud();
	    return;
	}


	var windowWidth = 500;
	var windowHeight = 300;

	var mouseLocation = NSEvent.mouseLocation();
	var windowX = mouseLocation.x-windowWidth/2;
	var windowY = mouseLocation.y-windowHeight+56;

	hud = NSPanel.alloc().init();
	hud.setFrame_display(NSMakeRect(windowX, windowY, windowWidth, windowHeight), true);

	hud.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask);
	hud.setBackgroundColor(NSColor.whiteColor());

	// Only show close button
    hud.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    hud.standardWindowButton(NSWindowZoomButton).setHidden(true);


	hud.setTitlebarAppearsTransparent(true);

	hud.becomeKeyWindow();
	hud.setLevel(NSFloatingWindowLevel);

	threadDictionary[identifier] = hud;

	// Make this a long-running CocoaScript
	COScript.currentCOScript().setShouldKeepAround_(true);

	var webView = WebView.alloc().initWithFrame(NSMakeRect(0, -19, windowWidth, windowHeight));
    var windowObject = webView.windowScriptObject();
    var delegate = new MochaJSDelegate({

        "webView:didFinishLoadForFrame:" : (function(webView, webFrame) {

            windowObject.evaluateWebScript(
                'externalCall(\'hello from CocoaScript\')'
            );

        }),

        "webView:didChangeLocationWithinPageForFrame:" : (function(webView, webFrame) {
        	var locationHash = windowObject.evaluateWebScript("window.location.hash");

        	runReceivedCommand(locationHash);
        })
    });

    webView.setFrameLoadDelegate_(delegate.getClassInstance());
    webView.setMainFrameURL_(context.plugin.urlForResourceNamed("hud.html").path());

	hud.contentView().addSubview(webView);
	hud.makeKeyAndOrderFront(nil);

	var closeButton = hud.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function(sender) {
        closeHud();
    });
    closeButton.setAction("callAction:");

    function closeHud() {
    	doc.showMessage('closing!');
    	COScript.currentCOScript().setShouldKeepAround(false);
        threadDictionary.removeObjectForKey(identifier);
        hud.close();
    }

    function runReceivedCommand(locationHash) {
    	var command = parseCommand(locationHash);
    	log( 'COMMAND RECEIVED: ' + command.name + ' ARGS: ' + command.args.join(' , ') );
    	log( 'dispatching to ' + command.name );
    	if ( command.name == 'setColor' ) {
    		setColor(command.args[0],command.args[1])
    	}

    }

    function parseCommand(hashString) {
    	hashString = hashString.substr(1)
    	var split = hashString.split(':');
    	return {
    		name: split[0],
    		args: split[1].split(';')
    	}
    }

    function getSelectedLayers(context) {
		var selection = context.selection;

		if (selection.count() == 0) {
		    context.document.showMessage("Please select at least one layer.");
		    return false;
		}

		return selection;
	}

    function setColor(type, colorString){
    	var color = MSImmutableColor.colorWithSVGString(colorString).newMutableCounterpart();
    	var selection = getSelectedLayers(context);
    	for (var i = 0; i < selection.count(); i++ ) {
    		if ( type == 'border' ) {
    			setBorderColor(selection.objectAtIndex(i), color);
    		} else {
    			setFillColor(selection.objectAtIndex(i), color);
    		}
    	}
    }
	// doc.showMessage('heads up end');


	function setFillColor(layer, color) {
	    if (layer.class() == "MSShapeGroup") {
	        var fills = layer.style().enabledFills();
	        if (fills.count() > 0 && fills.lastObject().fillType() == 0) {
	            fills.lastObject().setColor(color);
	        } else {
	            var fill = layer.style().addStylePartOfType(0);
	            fill.setFillType(0);
	            fills.lastObject().setColor(color);
	        }
	    }
	    if (layer.class() == "MSTextLayer") {
	        layer.setTextColor(color);
	    }
	}

	function setBorderColor(layer, color) {
	    if (layer.class() == "MSShapeGroup") {
	        var borders = layer.style().enabledBorders();
	        if (borders.count() > 0 ) {
	            borders.lastObject().setColor(color);
	        } else {
	            var border = layer.style().addStylePartOfType(1);
	            // border.setBorderType(1);
	            borders.lastObject().setColor(color);
	        }
	    }
	}
}
