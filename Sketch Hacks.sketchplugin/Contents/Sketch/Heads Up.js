@import 'MochaJSDelegate.js';


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

	hud = NSPanel.alloc().init();
	hud.setFrame_display(NSMakeRect(0, 0, windowWidth, windowHeight), true);

	hud.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask);
	hud.setBackgroundColor(NSColor.whiteColor());

	// Only show close button
    hud.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    hud.standardWindowButton(NSWindowZoomButton).setHidden(true);


	hud.setTitle('Heads Up');
	hud.setTitlebarAppearsTransparent(true);

	hud.becomeKeyWindow();
	hud.setLevel(NSFloatingWindowLevel);

	threadDictionary[identifier] = hud;

	// Make this a long-running CocoaScript
	COScript.currentCOScript().setShouldKeepAround_(true);

	hud.center();
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
