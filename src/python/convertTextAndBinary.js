function text2Binary(string) {
  return string
    .split('')
    .map(function (char) {
      return char.charCodeAt(0).toString(2);
    })
    .join(' ');
}

function binary2Words(str) {
  if (str.match(/[10]{8}/g)) {
    var wordFromBinary = str
      .match(/([10]{8}|\s+)/g)
      .map(function (fromBinary) {
        return String.fromCharCode(parseInt(fromBinary, 2));
      })
      .join('');
    return console.log(wordFromBinary);
  }
}

module.exports = {
  text2Binary,
  binary2Words,
};
