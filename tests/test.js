// Run: node tests/test.js
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/\/\/ <<CORE([\s\S]*?)\/\/ CORE>>/);
if (!m) { console.error('CORE block not found'); process.exit(1); }
const api = new Function(m[1] + '; return {parseJson,formatJson,minifyJson,jsonStats,encodeBase64,decodeBase64,isProbablyBase64,encodeUrlComponent,decodeUrlComponent,encodeUri};')();
let fails = 0;
const eq = (n, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails++; console.log(`FAIL ${n}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`); } };

// JSON
eq('valid json', api.parseJson('{"a":1}').ok, true);
const bad = api.parseJson('{"a":1,}');
eq('invalid json flagged', bad.ok, false);
eq('error has a position', typeof bad.error, 'string');
eq('format 2 spaces', api.formatJson('{"a":1}', '2').value, '{\n  "a": 1\n}');
eq('format tab', api.formatJson('{"a":1}', 'tab').value, '{\n\t"a": 1\n}');
eq('minify', api.minifyJson('{ "a" : 1 }').value, '{"a":1}');
eq('minify invalid', api.minifyJson('nope').ok, false);
eq('stats keys', api.jsonStats({a:1,b:{c:2}}).keys, 3);
eq('stats depth', api.jsonStats({a:{b:{c:1}}}).depth, 4);

// Base64
eq('b64 round trip', api.decodeBase64(api.encodeBase64('hello world')), 'hello world');
eq('b64 unicode', api.decodeBase64(api.encodeBase64('नमस्ते 🎉')), 'नमस्ते 🎉');
eq('b64 known value', api.encodeBase64('Man'), 'TWFu');
eq('b64 detector yes', api.isProbablyBase64('TWFu'), true);
eq('b64 detector no', api.isProbablyBase64('not base64!'), false);
eq('b64 empty', api.encodeBase64(''), '');

// URL
eq('encode component', api.encodeUrlComponent('a b&c'), 'a%20b%26c');
eq('decode component', api.decodeUrlComponent('a%20b%26c'), 'a b&c');
eq('decode plus as space', api.decodeUrlComponent('a+b'), 'a b');
eq('encodeUri keeps slashes', api.encodeUri('https://a.com/p q'), 'https://a.com/p%20q');

console.log(fails ? `\n${fails} FAILURE(S)` : 'ALL DEVTOOLBOX TESTS PASSED');
process.exit(fails ? 1 : 0);
