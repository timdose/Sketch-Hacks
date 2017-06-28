
// Your code goes here

var getBaseline = function (fontSize, lineHeight) {
	if (lineHeight == 0 ) {
		return Math.round(fontSize*.75);
	}
	return Math.ceil((fontSize + lineHeight)/2);
}


var exports = typeof exports === 'undefined'? this['mymodule']={} : exports;

exports.getBaseline = getBaseline;
