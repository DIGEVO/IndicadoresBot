var http = require('http');
var Symbol = require('symbol');

var Indicators = {
    uf: { name: "uf", startyear: 1977 }                   //Unidad de fomento.
    , ivp: { name: "ivp", startyear: 1990 }                 //Indice de valor promedio.
    , dolar: { name: "dolar", startyear: 1984 }               //Dólar observado.
    , dolar_intercambio: { name: "dolar_intercambio", startyear: 1988 }   //Dólar acuerdo.
    , euro: { name: "euro", startyear: 1999 }                //euro.
    , ipc: { name: "ipc", startyear: 1928 }                 //Índice de Precios al Consumidor
    , utm: { name: "utm", startyear: 1990 }                 //Unidad Tributaria Mensual.
    , imacec: { name: "imacec", startyear: 2004 }              //Imacec.
    , tpm: { name: "tpm", startyear: 2001 }                 //Tasa Política Monetaria.
    , libra_cobre: { name: "libra_cobre", startyear: 2012 }        //Libra de Cobre.
    , tasa_desempleo: { name: "tasa_desempleo", startyear: 2009 }    //Tasa de desempleo.
}

function getIndicatorByYear(indicator, year) {
    let url = `http://mindicador.cl/api/${indicator.name}/${year}`;

    return getIndicator(url);
}

function getIndicator(url) {
    let result = {};

    var request = new Promise((resolve, reject) => {
        http.get(url, (response) => {
            const { statusCode } = response;
            const contentType = response.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                response.resume();
                return;
            }

            response.setEncoding('utf8');
            let rawData = '';
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                try {
                    // const parsedData = JSON.parse(rawData);
                    // console.log(parsedData);
                    result = JSON.parse(rawData);
                } catch (e) {
                    // console.error(e.message);
                    // result = {};
                }
            });
        });

        request.on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });

        request.end();
    });

    Promise.all([request]);

    return result;
}

console.log(getIndicatorByYear(Indicators.dolar, 2017));

// var pp = new Promise(() => 3);

// Promise.all([pp]).then((a) => console.log(a));


