const { PythonShell } = require('python-shell');

const testFunction = () => {
  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'src/python',
    args: ['nameFunction', 'HAY QUA', 'Thang Ne'], // name function, argument..
  };
  return PythonShell.run('test.py', options).then((messages) => {
    return messages;
  });
};

module.exports = {
  testFunction,
};
