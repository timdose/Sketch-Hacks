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


	var windowWidth = 200;
	var windowHeight = 150;

	var mouseLocation = NSEvent.mouseLocation();
	var windowX = mouseLocation.x-windowWidth/2;
	var windowY = mouseLocation.y-windowHeight+20;

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

	var webView = WebView.alloc().initWithFrame(NSMakeRect(0, -24, windowWidth, windowHeight));
    var windowObject = webView.windowScriptObject();


    webView.setMainFrameURL_(context.plugin.urlForResourceNamed("hud.html").path());
    // webView.reload(null);

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

	doc.showMessage('heads up end');
}
