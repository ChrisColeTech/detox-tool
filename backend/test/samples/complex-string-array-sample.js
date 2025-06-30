// Complex string array sample with multiple arrays and nested calls
// Represents more sophisticated obfuscation patterns

var _0xabc123 = ['first', 'second', 'third', 'method', 'property'];
var _0xdef456 = ['React', 'createElement', 'div', 'span', 'component'];

function _0x789abc(_0x111, _0x222) {
    _0x111 = _0x111 - 0x0;
    var _0x333 = _0xabc123[_0x111];
    return _0x333;
}

function _0xfff000(_0x444, _0x555) {
    _0x444 = _0x444 - 0x0;
    var _0x666 = _0xdef456[_0x444];
    return _0x666;
}

// Nested string array calls
var _0x777 = _0x789abc;
var _0x888 = _0xfff000;

// Complex usage patterns
obj[_0x777('0x3')] = _0x777('0x0');
window[_0x888('0x0')][_0x888('0x1')](_0x888('0x2'), {
    [_0x777('0x4')]: _0x777('0x1')
});

// Expected deobfuscated output:
// obj.method = 'first';
// window.React.createElement('div', {
//     property: 'second'
// });