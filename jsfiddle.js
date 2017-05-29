var http = require('https');
var fs = require('fs');
var readline = require('readline');
var exec = require('child_process').execSync;

function getVersion(fiddleId, versionNumber) {
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
    http.get(requestOptions, function (response) {
        switch (response.statusCode) {
            case 200:
                console.log("ok");
                response.on('data', function (chunk) {
                    storeVersion(fiddleId, versionNumber, chunk.toString());
                });
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

function storeVersion(fiddleId, version, response) {
    var result = fs.writeFileSync(fiddleId + "/index.html", response);
    exec("git add .", { cwd: fiddleId });

    try {
        exec("git commit -m \"Version " + version + " (https://jsfiddle.net/" + fiddleId + "/" + version + ")\"", { cwd: fiddleId });
    }
    catch (err) {
        console.warn("git commit failed (possibly no changes since last version?)");
    }

    fs.unlinkSync(fiddleId + '/index.html');
    getVersion(fiddleId, version += 1);
}

function initRepo(fiddleId) {
    if (fs.existsSync(fiddleId) == false) {
        fs.mkdir(fiddleId);
    }

    exec("git init", { cwd: fiddleId });
    createReadMe(fiddleId);
}

function createReadMe(fiddleId){
    var readMeContents = "# Archive of JS Fiddle " + fiddleId + "\r\n\r\nGit repository created from all versions of JS Fiddle [" + fiddleId + "](https://jsfiddle.net/" + fiddleId + ")";
    fs.writeFileSync(fiddleId + "/README.md", readMeContents);
    exec("git add .", { cwd: fiddleId });
    exec("git commit -m \"Repository creation\"", { cwd: fiddleId });
}

function getFiddleId() {
    var readLineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLineInterface.question('fiddle id: ', (answer) => {
        initRepo(answer);
        getVersion(answer, 0);
    });
}

getFiddleId();
