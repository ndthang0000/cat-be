const AdmZip = require('adm-zip');
const { create } = require('xmlbuilder2');
const Tokenizer = require('sentence-tokenizer');
const tokenizer = new Tokenizer();

const MAX_LEVEL = 4; // level con w:t trong w:p

class DocxFile {
  constructor(filePath) {
    this.zip = new AdmZip(filePath);
    this.xmlFiles = [];

    const xmlFiles = ['document', 'endnotes', 'footer', 'footnotes', 'header'];
    const zipEntries = this.zip.getEntries();

    zipEntries.forEach((zipEntry) => {
      for (const xmlFile of xmlFiles) {
        if (zipEntry.entryName.includes(`word/${xmlFile}`)) {
          this.xmlFiles.push(zipEntry.entryName);
        }
      }
    });

    this.wts = [];
    this.sentences = [];
    this.describe = [];

    for (const xmlFile of this.xmlFiles) {
      const xmlData = this.zip.readAsText(xmlFile);
      this[xmlFile] = create(xmlData);
      const wps = this[xmlFile].filter((n) => n.node.nodeName === 'w:p', false, true);

      for (let i = 0; i < wps.length; i++) {
        let sentence = '';

        const wts = wps[i].filter((n, i, lv) => n.node.nodeName === 'w:t' && lv < MAX_LEVEL, false, true);
        for (let j = 0; j < wts.length; j++) {
          if (wts[j].node.textContent === '') sentence += ' ';
          else sentence += wts[j].node.textContent;
          this.wts.push(wts[j]);
        }

        if (sentence !== '') {
          tokenizer.setEntry(sentence);
          const tokens = tokenizer.getSentences();

          this.sentences.push(...tokens);
          this.describe.push({ tokensLen: tokens.length, wtsLen: wts.length });
        }
      }
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

    let newSentenceIndex = 0;
    let wtIndex = 0;

    for (let i = 0; i < this.describe.length; i++) {
      let sentence = '';

      for (let j = 0; j < this.describe[i].tokensLen; j++) {
        if (j > 0) sentence += '';
        sentence += newSentences[newSentenceIndex];
        newSentenceIndex++;
      }

      this.wts[wtIndex].node.textContent = sentence;
      for (let j = 1; j < this.describe[i].wtsLen; j++) {
        this.wts[wtIndex + j].node.parentNode.remove();
      }
      wtIndex += this.describe[i].wtsLen;
    }

    for (const xmlFile of this.xmlFiles) {
      const xmlContent = this[xmlFile].end();
      this.zip.updateFile(xmlFile, xmlContent);
    }

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

module.exports = DocxFile;
