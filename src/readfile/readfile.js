const fs = require('fs');

const readFile = async (name) => {
  const data = fs.readFileSync(`uploads/${name}`, { encoding: 'utf-8' });
  console.log(data);
  console.log('vô đây');
};
readFile('test.docx');
