// Phase 1 Demonstration Sample
// This sample demonstrates the complete string array deobfuscation capability

// Multiple obfuscated string arrays
var _0x4d2f = ['Hello', 'World', 'console', 'log', 'welcome', 'user'];
var _0x89e1 = ['React', 'createElement', 'div', 'className', 'component'];

// Multiple decoder functions with different patterns
function _0x1a3b(_0x2c4d, _0x5e6f) {
    _0x2c4d = _0x2c4d - 0x0;
    var _0x7a8b = _0x4d2f[_0x2c4d];
    return _0x7a8b;
}

function _0x9c0d(_0x1e2f) {
    return _0x89e1[_0x1e2f];
}

// Function assignments
var _0x3a4b = _0x1a3b;
var _0x5c6d = _0x9c0d;

// Complex obfuscated code using the string arrays
console[_0x3a4b('0x2')](_0x3a4b('0x0') + ' ' + _0x3a4b('0x1'));
window[_0x3a4b('0x4')] = _0x3a4b('0x5');

// React component creation using obfuscated strings
var element = window[_0x5c6d(0)][_0x5c6d(1)](_0x5c6d(2), {
    [_0x5c6d(3)]: _0x5c6d(4)
});

// Expected deobfuscated output:
// console.log('Hello' + ' ' + 'World');
// window.welcome = 'user';
// var element = window.React.createElement('div', {
//     className: 'component'
// });