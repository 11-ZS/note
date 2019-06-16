const fs = require('fs');
const path = require('path');
const configPath = './config.json'
var config
var shieldList = []

// fs.readFile('./config.json','utf-8',(err,data)=>{
//     console.log(data);
//     shieldList = JSON.parse(data).shieldList;

// })


// getConfig(configPath)
//     .then(result => {
//         shieldList = JSON.parse(result).shieldList;
//     }) 

getConfig()
.then((result) => {
    console.log('-----',result);
    config= JSON.parse(result);
    shieldList = config.shieldList;
})
.then(result=>{
    
    // control
    shieldList.splice(shieldList.length-1,1);
    setConfig();
})
 
function setConfig() {
    fs.writeFile(configPath, JSON.stringify(config), (err) => {
        if (!err) {
            console.log('write success')
        }
    })
}

function getConfig() {
    return new Promise(function (resolve, reject) {
        fs.readFile(configPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
}

function readdir(url) {

    fs.readdir(url, (err, file) => {
        file.forEach(element => {

            fs.stat(path.join(url, element), (err, stats) => {
                if (isShield(element)) {
                    return;
                }
                if (err) {
                    console.log(element);
                    return;
                }
                if (stats.isDirectory()) {
                    readdir(path.join(url, element));

                }
                console.log(element);
            })
        });
    })
}


function isShield(name) {
    return shieldList.find(item => {
        return item === name
    });
}
