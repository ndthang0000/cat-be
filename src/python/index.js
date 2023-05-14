const { PythonShell } = require('python-shell');

const sentenceTokenizeFromFileDocx = (args) => {
  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'src/python',
    encoding: 'utf-8',
    args, // ['nameFunction', 'HAY QUA', 'Thang Ne'], // name function, argument..
  };
  return PythonShell.run('translatorDocx.py', options).then((messages) => {
    return messages;
  });
};

const translating = (args) => {
  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'src/python',
    encoding: 'utf-8',
    args, // ['nameFunction', 'HAY QUA', 'Thang Ne'], // name function, argument..
  };
  return PythonShell.run('docxHandler.py', options).then((messages) => {
    console.log(messages);
    return messages;
  });
};

module.exports = {
  sentenceTokenizeFromFileDocx,
  translating,
};
