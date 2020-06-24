const got = require('got');
const fs = require('fs');
const request = require('request');
const commander = require('commander');

function get(url) {
    console.log(`GET ${url}`);
    got(url).then(res => {
        console.log(res.body);
    })
};

function upload(url, file) {
    console.log(`UPLOAD ${url} FILE ${file}`);
    let req = request.post(url, function (err, resp, body) {
        if (err) {
            console.log('Error!');
        } else {
            console.log('URL: ' + body);
        }
    });
    let form = req.form();
    form.append('file', fs.createReadStream(file));
}

commander.option('--ip [value]', 'server ip').parse(commander.argv);

get(`http://${commander.ip}:40000/`);
upload(`http://${commander.ip}:40000/upload`, './file/example');