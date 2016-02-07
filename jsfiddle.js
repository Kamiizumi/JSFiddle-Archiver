var http = require('https');
var fs = require('fs');
var readline = require('readline');

function getVersion(fiddleId, versionNumber){
  console.log("Getting version " + versionNumber);

  var requestOptions = {
    host: 'fiddle.jshell.net',
    port: 443,
    path: '/' + fiddleId + '/' + versionNumber + '/show/light/',
    headers: {
      referer: 'https://fiddle.jshell.net/' + fiddleId + '/' + versionNumber + '/show/light/'
    }
  };

  console.log("Starting request");
  http.request(requestOptions, function(response){
    switch(response.statusCode){
      case 200:
        console.log("ok");
        storeVersion(fiddleId, versionNumber, response);
        break;
      case 404:
        console.log("not found");
        break;
      default:
        console.log(res);
        console.log("err");
        break;
    }
  }).end();
}

function storeVersion(fiddleId, version, response){
    var result = fs.createWriteStream(version + ".html");
    response.pipe(result);

    getVersion(fiddleId, version += 1);
}

function getFiddleId(){
  var readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readLineInterface.question('fiddle id: ', (answer) => {
    getVersion(answer, 0);
  });
}

getFiddleId();
