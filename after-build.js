const fs = require('fs');

const whitelist = [
  /white-board-widget\.js/,
  /widget-ico\.png/,
  /od-manifest\.json/,
  /static\/media\/(.+)\.png$/
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
        console.log(filepath + ' removed');
        fs.unlinkSync(filepath);
        rmcount --;
      }
    }
  }

  if (rmcount === 0) {
    fs.rmdirSync(dirPath);
    console.log(dirPath + ' removed');
  }
}

removeFilesInDirectory('build');
