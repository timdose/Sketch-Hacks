var getBaseline = require('./util').getBaseline;

var allClear = true;


var test = function(id) {
    var message = id + ': ';
    return {
        expect: function(test) {
            return {
                toEqual: function (comparison) {
                    if ( test != comparison ) {
                        console.log( message + '✖︎ expected ' + test + ' to equal ' + comparison );
                        allClear = false
                    } else {
                        console.log(message + '✓')
                    }
                }
            }
        }
    }
}



test('  16,0').expect( getBaseline(16,0) ).toEqual(12)
test(' 16,16').expect( getBaseline(16,16) ).toEqual(16)
test(' 16,22').expect( getBaseline(16,22) ).toEqual(19)
test(' 16,56').expect( getBaseline(16,56) ).toEqual(36)
test('16,103').expect( getBaseline(16,103) ).toEqual(60)
test('  23,0').expect( getBaseline(23,0) ).toEqual(17)
test(' 23,23').expect( getBaseline(23,23) ).toEqual(23)
test(' 23,24').expect( getBaseline(23,24) ).toEqual(24)
test(' 23,56').expect( getBaseline(23,56) ).toEqual(40)
test('23,103').expect( getBaseline(23,103) ).toEqual(63)
test('  57,0').expect( getBaseline(57,0) ).toEqual(43)
test('  19,0').expect( getBaseline(19,0) ).toEqual(14)
test('  22,0').expect( getBaseline(22,0) ).toEqual(17)
test('  92,0').expect( getBaseline(92,0) ).toEqual(69)


if ( allClear ) {
    console.log('All clear!');
}
