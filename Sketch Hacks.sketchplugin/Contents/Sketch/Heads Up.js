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
	    threadDictionary.removeObjectForKey(identifier);
	    hud.close();
	    return;
	}

	var windowWidth = 200;
	var windowHeight = 150;

	hud = NSPanel.alloc().init();
	hud.setFrame_display(NSMakeRect(0, 0, windowWidth, windowHeight), true);

	hud.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask);
	hud.setBackgroundColor(NSColor.whiteColor());


	hud.setTitle('Heads Up');

	hud.becomeKeyWindow();
	hud.setLevel(NSFloatingWindowLevel);

	threadDictionary[identifier] = hud;

	// Make this a long-running CocoaScript
	COScript.currentCOScript().setShouldKeepAround_(false);

	hud.center();
	hud.makeKeyAndOrderFront(nil);

	var closeButton = hud.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function(sender) {
        COScript.currentCOScript().setShouldKeepAround(false);
        threadDictionary.removeObjectForKey(identifier);
        hud.close();
    });
    closeButton.setAction("callAction:");

	doc.showMessage('heads up end!!!');
}
