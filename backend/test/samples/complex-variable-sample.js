// Complex Variable Recovery Sample
// More challenging patterns with nested scopes and complex usage

// Nested function scopes
function _0x1111() {
    var _0x2222 = 'outer';
    
    function _0x3333(_0x4444) {
        var _0x5555 = _0x2222 + _0x4444;
        
        return function(_0x6666) {
            var _0x7777 = _0x5555 + _0x6666;
            return _0x7777;
        };
    }
    
    return _0x3333;
}

// Class-like pattern
function _0x8888(_0x9999) {
    this._0xaaaa = _0x9999;
    this._0xbbbb = function() {
        return this._0xaaaa * 2;
    };
}

// Callback patterns
var _0xcccc = [1, 2, 3, 4, 5];
var _0xdddd = _0xcccc.filter(function(_0xeeee) {
    return _0xeeee % 2 === 0;
}).map(function(_0xffff) {
    return _0xffff * _0xffff;
});

// React component pattern
function _0x1000(_0x2000) {
    var _0x3000 = _0x2000.data || [];
    var _0x4000 = React.useState(false);
    var _0x5000 = _0x4000[0];
    var _0x6000 = _0x4000[1];
    
    var _0x7000 = function() {
        _0x6000(!_0x5000);
    };
    
    return React.createElement('div', {
        onClick: _0x7000,
        className: _0x5000 ? 'active' : 'inactive'
    }, _0x3000.map(function(_0x8000, _0x9000) {
        return React.createElement('span', {
            key: _0x9000
        }, _0x8000);
    }));
}

// Promise/async pattern
function _0xa000(_0xb000) {
    return new Promise(function(_0xc000, _0xd000) {
        setTimeout(function() {
            if (_0xb000) {
                _0xc000('Success');
            } else {
                _0xd000(new Error('Failed'));
            }
        }, 1000);
    });
}

// Expected semantic names:
// _0x1111 -> createClosure or outerFunction
// _0x2222 -> outerValue or baseText
// _0x3333 -> innerFunction or combiner
// _0x4444 -> input or param
// _0x5555 -> combined or result
// _0x6666 -> additional or extra
// _0x7777 -> finalResult
// _0x8888 -> Constructor or MyClass
// _0x9999 -> initialValue
// _0xaaaa -> value or data
// _0xbbbb -> doubleValue or getDouble
// _0xcccc -> numbers or array
// _0xdddd -> evenSquares or processedNumbers
// _0xeeee -> num or item
// _0xffff -> value or element
// _0x1000 -> MyComponent
// _0x2000 -> props
// _0x3000 -> data or items
// _0x4000 -> stateHook or useState
// _0x5000 -> isActive or state
// _0x6000 -> setIsActive or setState
// _0x7000 -> handleClick or toggleState
// _0x8000 -> item or element
// _0x9000 -> index
// _0xa000 -> asyncOperation or createPromise
// _0xb000 -> condition or shouldSucceed
// _0xc000 -> resolve
// _0xd000 -> reject