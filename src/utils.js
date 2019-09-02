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
        splitted = [
          ...splitted,
          ...splitAndMeasureBy(ftext, tempLine, width, '')
        ];
      } else if (prevTempLine !== '') {
        splitted.push(prevTempLine);
        i --;
      } else {
        splitted.push(tempLine);
      }

      tempLine = '';
    } else if (m.width === width) {
      splitted.push(tempLine);
    }

    prevTempLine = tempLine;
  }

  if (prevTempLine) {
    splitted.push(prevTempLine);
  }

  console.log('splitted: ', splitted)

  return splitted;
};
