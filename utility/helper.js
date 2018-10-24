const readline          = require('readline');
const axios             = require('axios');
const childProcess      = require('child_process');
const fs                = require('fs');

//func used to exec script from within a script being run from node
const runScript = (scriptPath, callback) => {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;
  let process = childProcess.fork(scriptPath);
  // listen for errors as they may prevent the exit event from firing
  process.on('error', (err) => {
      if (invoked) return;
      invoked = true;
      callback(err);
  });
  // execute the callback once the process has finished running
  process.on('exit', (code)=>  {
      if (invoked) return;
      invoked = true;
      let err = code === 0 ? null : new Error('exit code ' + code);
      callback(err);
  });
};

//execute script to initiate server 
let startServer = async () => {
  let started = await runScript('./server/index.js', err => {
    if (err) throw err;
  })
};

//takes incoming query string and breaks it apart into an array separated at any ':'
const searchList = (params) => {
  let list = params.split(':');
  return list;
};

//preps query items by removing the white space and adding '+' in it's place -> follows syntax of scryfall rest api url
const prepQueryItem = (string) => {
  let newString = string.replace(' ', '+');
  return newString;
};

//creating promise array
const createPromiseArray = (array) => {
  let promises = [];
  
  for (let i = 0; i < array.length; i++) {
    promises.push(axios.get(`https://api.scryfall.com/cards/named?exact=${array[i]}`))
  };
  return promises;
};

const api_request = (array, callback) => {
  let promises = createPromiseArray(array);
  let theResult;
  return axios.all(promises).then(async result => {
    let temp = result.map(response => {
      response.data;
      return response.data
    });
    let results = await temp;
      return results;
    }).then(result => {
      theResult = result;
      return theResult;
    });
};

const retrieveData = (data) => {
  let theData = data;
  return theData;
};

const server_request = (string) => {
  return new Promise (resolve => {
    axios.get(`http://localhost:8081/callAPI/${string}`, string).then(response => {
      console.log('complete', response.data)
      return response.data;
    });
  });
};

const streamPromise = (stream) => {
  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      resolve('end');
    });
    stream.on('finish', () => {
      resolve({'status': true, 'error': ''});
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

const download_image = (url, image_path) => axios( {'url': url, 'responseType': 'stream' } ).then(response => {
    let stream = fs.createWriteStream(image_path);
    let completed = false;

    response.data.pipe(stream);
    return streamPromise(stream);
  }).catch(error => ( {'status': false, 'error': 'Error: ' + error.message}));

module.exports = {
  runScript: runScript,
  startServer: startServer,
  searchList: searchList,
  prepQueryItem: prepQueryItem,
  server_request: server_request,
  api_request: api_request,
  retrieveData: retrieveData,
  download_image: download_image
};