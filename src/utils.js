export const noop = () => {};

export const splitAndMeasureBy = (ftext, line, width, splitChar) => {
  let splitted = [];
  let words = line.split(splitChar);
  let prevTempLine = '';
  let tempLine = '';
  for (let i = 0; i < words.length; i++) {
    tempLine += tempLine ? splitChar + words[i] : words[i];
    ftext.set({
      text: tempLine
    });
    let m = ftext.measureLine(0);
    if (m.width >= width) {
      if (prevTempLine === '' && splitChar !== '') {
        splitted = splitted.concat(
          splitted,
          splitAndMeasureBy(ftext, tempLine, width, '')
        );
        tempLine = '';
      } else if (prevTempLine !== '') {
        splitted.push(prevTempLine);
        tempLine = words[i];
      } else {
        splitted.push(tempLine);
        tempLine = '';
      }
    } else if (m.width === width) {
      splitted.push(tempLine);
      tempLine = '';
    }

    prevTempLine = tempLine;
  }

  if (prevTempLine) {
    splitted.push(prevTempLine);
  }

  return splitted;
};
