const fs = require('fs');
const path = require('path');

function recursiveMkDir(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  function mkdir(_path, root) {
    const dirs = _path.split(path.sep);
    const dir = dirs.shift();
    root = (root || '') + dir + path.sep;

    try {
      fs.mkdirSync(root);
    } catch (e) {
      if (!fs.statSync(root).isDirectory()) { throw new Error(e); }
    }

    return !dirs.length || mkdir(dirs.join(path.sep), root);
  }
}

module.exports = recursiveMkDir;
