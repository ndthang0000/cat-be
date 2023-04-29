const textToImage = require('text-to-image');
var randomColor = require('randomcolor');
const publicURL = require('../../get_url');

const generateImage = async (text, name) => {
  text = text.length > 10 ? text.slice(0, 6) : text;
  const dataUri = await textToImage.generate(text, {
    bgColor: randomColor(),
    verticalAlign: 'center',
    textColor: randomColor(),
    textAlign: 'center',
    customHeight: 400,
    fontSize: 80,
    fontWeight: '600',
    lineHeight: 80,
    debugFilename: publicURL + `/generate-image/${name}.png`,
    debug: true,
  });
  return dataUri;
};

module.exports = generateImage;
