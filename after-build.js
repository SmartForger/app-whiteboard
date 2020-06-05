const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid4');
const manifest = require('./public/od-manifest.json');


function logWrite(msg) {
  var stream = fs.createWriteStream(__dirname + '/bundle_app.log', { flags: 'a' });
  const output = '[' + (new Date().toISOString()) + '] ' + msg;
  console.log(output);
  stream.write(output + '\n');
}

const whitelist = [
  /white-board-widget\.js/,
  /widget-ico\.png/,
  /od-manifest\.json/
];

function removeFilesInDirectory(directory, path = '.') {
  const dirPath = path + '/' + directory;

  const files = fs.readdirSync(dirPath);
  let rmcount = files.length;

  for (const file of files) {
    const stat = fs.lstatSync(dirPath + '/' + file);

    if (stat.isDirectory()) {
      removeFilesInDirectory(file, dirPath);

    } else {
      const filepath = dirPath + '/' + file;

      if (whitelist.every(exp => !exp.test(filepath))) {
        logWrite('AfterBuild.removeFilesInDirectory :: Removing file [' + filepath + ']');
        fs.unlinkSync(filepath);
        rmcount--;
      }
    }
  }

  if (rmcount === 0) {
    logWrite('AfterBuild.removeFilesInDirectory :: Removing directory [' + dirPath + ']');
    fs.rmdirSync(dirPath);
  }
}


async function obfuscate(buildDirectoryPath) {
  try {
    if (manifest.app && manifest.app.tag && manifest.app.bootstrapModule) {
      manifest.app.tag = await _obfuscateFile(buildDirectoryPath, manifest.app.bootstrapModule, manifest.app.tag);

    } else {
      manifest.app = null;
    }

    for (let i = 0; i < manifest.widgets.length; ++i) {
      manifest.widgets[i].tag = await _obfuscateFile(buildDirectoryPath, manifest.widgets[i].bootstrapModule, manifest.widgets[i].tag);
    }

    await fs.writeJSON(path.join(buildDirectoryPath, 'od-manifest.json'), manifest);

    return manifest;

  } catch (err) {
    logWrite('AfterBuild.obfuscateFile :: Encountered exception:');
    logWrite(err.message);
    return null;
  }
}

async function _obfuscateFile(buildDirectoryPath, bootstrapModule, customElementTag) {
  const filePath = path.join(buildDirectoryPath, bootstrapModule);

  logWrite('AfterBuild._obfuscateFile :: Obfuscating file contents: [' + filePath + ']');

  let contents = await fs.readFile(filePath, 'utf8');

  const elementRegExp = new RegExp(customElementTag, 'g');
  const webpackRegExp = new RegExp('window.webpackJsonp', 'gi');
  const newTag = 'od' + uuid();
  const newWebpack = 'window.' + _stripNumbersAndDashes(uuid());

  let matches = contents.match(elementRegExp);
  if (!matches) {
    throw new Error();
  }

  contents = contents.replace(elementRegExp, newTag);
  contents = contents.replace(webpackRegExp, newWebpack);

  await fs.writeFile(filePath, contents);
  return newTag;
}

function _stripNumbersAndDashes(value) {
  return value.replace(/[0-9\-]/g, '');
}


logWrite('AfterBuild.main :: ----------------------------------------');
logWrite('AfterBuild.main :: ---     Cleaning Up Asset Bundle     ---');
logWrite('AfterBuild.main :: ----------------------------------------');
logWrite('AfterBuild.main :: --- Stripping out unnecessary files  ---');
logWrite('AfterBuild.main :: ----------------------------------------');

removeFilesInDirectory('build');

logWrite('AfterBuild.main :: ------------------------------------------------------------------------------------------------');
logWrite('AfterBuild.main :: ---                                     Obfuscating Tags                                     ---');
logWrite('AfterBuild.main :: ------------------------------------------------------------------------------------------------');
logWrite('AfterBuild.main :: --- This operation prevents collisions between custom element tags provided by third parties ---');
logWrite('AfterBuild.main :: --- We also protect against some global library reference conflicts during this step         ---');
logWrite('AfterBuild.main :: ------------------------------------------------------------------------------------------------');

obfuscate('build');
