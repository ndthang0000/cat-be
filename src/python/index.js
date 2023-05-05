const { PythonShell } = require('python-shell');

const pythonScript = (args) => {
  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'src/python',
    args, // ['nameFunction', 'HAY QUA', 'Thang Ne'], // name function, argument..
  };
  return PythonShell.run('utils.py', options).then((messages) => {
    return messages;
  });
};

module.exports = {
  pythonScript,
};
