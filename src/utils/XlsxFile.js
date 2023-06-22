const AdmZip = require('adm-zip');
const { create } = require('xmlbuilder2');
const Tokenizer = require('sentence-tokenizer');
const tokenizer = new Tokenizer();

class XlsxFile {
  constructor(filePath) {
    this.zip = new AdmZip(filePath);

    const xmlData = this.zip.readAsText('xl/sharedStrings.xml');
    this.jObj = create(xmlData);

    this.sis = this.jObj.filter((n) => n.node.nodeName === 'si', true, true);
    this.sentences = [];
    this.nTokens = [];

    for (const si of this.sis) {
      const sentence = si.node.textContent;

      tokenizer.setEntry(sentence);
      const tokens = tokenizer.getSentences();

      this.sentences.push(...tokens);
      this.nTokens.push(tokens.length);
    }
  }

  // Getter - Setter
  getSentences() {
    return this.sentences;
  }

  // Method
  exportFile(newSentences, path) {
    if (this.sentences.length !== newSentences.length) {
      return 'Number of sentences is invalid';
    }

    const realSentences = [];
    let index = 0;
    for (const nToken of this.nTokens) {
      let realSentence = '';
      for (let i = 0; i < nToken; i++) {
        if (i > 0) realSentence += ' ';
        realSentence += newSentences[index];
        index++;
      }
      realSentences.push(realSentence);
    }
    //xem xet gop chung vong for ben tren ////////////////////////////////////
    for (let i = 0; i < realSentences.length; i++) {
      this.sis[i].remove();
      this.jObj.root().ele({ si: { t: realSentences[i] } });
    }

    const xmlContent = this.jObj.end();
    this.zip.updateFile('xl/sharedStrings.xml', xmlContent);

    const zip = new AdmZip();
    const entries = this.zip.getEntries();
    for (const entry of entries) {
      if (entry.name !== '') {
        zip.addFile(entry.entryName, entry.getData());
      }
    }
    zip.writeZip(path);
  }
}

module.exports = XlsxFile;
