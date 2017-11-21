const csv = require('csvtojson');
const path = require('path');

const promise = new Promise((resolve, reject) => {
    const arr = [];
    csv().fromFile(path.resolve(__dirname, '../data/products.csv'))
        .on('json',(jsonObj)=>{
            arr.push(jsonObj);
        })
        .on('done',(error)=>{
            if (error) reject(error);
            resolve(arr);
        });
});

module.exports = promise;