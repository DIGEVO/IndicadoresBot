// var http = require('http');
// var url = 'http://mindicador.cl/api/dolar/2017';
// var p = new Promise((resolve, reject) => {
//     let request = http.get(url, (response) => {
//         const { statusCode } = response;
//         const contentType = response.headers['content-type'];

//         let error;
//         if (statusCode !== 200) {
//             error = new Error('Request Failed.\n' +
//                 `Status Code: ${statusCode}`);
//         } else if (!/^application\/json/.test(contentType)) {
//             error = new Error('Invalid content-type.\n' +
//                 `Expected application/json but received ${contentType}`);
//         }
//         if (error) {
//             console.error(error.message);
//             // consume response data to free up memory
//             response.resume();
//             return;
//         }

//         response.setEncoding('utf8');
//         let rawData = '';
//         response.on('data', (chunk) => { rawData += chunk; });
//         response.on('end', () => {
//             try {
//                 // const parsedData = JSON.parse(rawData);
//                 // console.log(parsedData);
//                 result = JSON.parse(rawData);
//             } catch (e) {
//                 // console.error(e.message);
//                 // result = {};
//             }
//         });
//     });

//     // request.on('error', (e) => {
//     //     console.error(`Got error: ${e.message}`);
//     // });

//     // request.end();
// });

// Promise.all([p]).then((a) => {
//     console.log(a);
// });


'use strict';

const httpService = require('./httpService'); // the above wrapper

// get one URL
// httpService.get('http://mindicador.cl/api/dolar/2017').then(function gotData(data) {
//     console.log(data);
// });

// 
// // get multiple URLs
const urls = [
    'http://mindicador.cl/api/dolar/2017'
];

/* map the URLs to Promises. This will actually start the
 * requests, but Promise.prototype.then is always called,
 * even if the operation has resolved */
const promises = urls.map(url => httpService.get(url));

Promise.all(promises).then(function gotData(responses) {
    /* responses is an array containing the result of each
     * Promise. This is ordered by the order of the URLs in the
     * urls array */

    const swansonQuote = responses[0];
   // const chuckNorrisQuote = responses[1];

    console.log(swansonQuote);
  //  console.log(chuckNorrisQuote);
});

console.log('asdasdasdasd');




















