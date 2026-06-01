// Patches lodash 4.18.x npm packaging bug where _customOmitClone.js is
// listed in the tarball but not extracted. Without this file, require('lodash/omit')
// fails at runtime with "Unable to resolve ./_customOmitClone".
const fs = require('fs');
const path = require('path');

let lodashDir;
try {
  lodashDir = path.dirname(require.resolve('lodash/package.json'));
} catch {
  console.log('patch-lodash: lodash not found, skipping');
  process.exit(0);
}

const target = path.join(lodashDir, '_customOmitClone.js');

if (fs.existsSync(target)) process.exit(0);

const content = `var isPlainObject = require('./isPlainObject');

function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;
`;

try {
  fs.writeFileSync(target, content);
  console.log('patch-lodash: created missing _customOmitClone.js');
} catch (err) {
  console.warn('patch-lodash: could not write patch file:', err.message);
}
