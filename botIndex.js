'use strict';

var restify = require('restify');
var builder = require('botbuilder');

const RestClient = require('./BusinessLogic/RestClient');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//todo hacerlo proactivo, en cuanto se conecte q me salude y pregunte.
bot.dialog('/', [
    function (session, result, next) {
        //ver la hora del usuario y saludarlo apropidamente...
        builder.Prompts.choice(session,
            `Hola ${session.message.user.name}, ¿cuál acción desea realizar?`,
            'Comparar valor de indicador|Conocer valor de indicador', { listStyle: builder.ListStyle.button });
    },
    function (session, result) {
        session.dialogData.opcion = result.response.entity;
        builder.Prompts.choice(session, '¿Cuál de los siguientes indicadores deseas conocer?',
            ['Unidad de fomento', 'Indice de valor promedio',
                'Dólar observado', ' Dólar acuerdo', 'Euro',
                'Índice de Precios al Consumidor',
                'Unidad Tributaria Mensual', 'Imacec',
                'Tasa Política Monetaria',
                'Libra de Cobre', 'Tasa de desempleo'].join('|'),
            { listStyle: builder.ListStyle.list });
    },
    function (session, results) {
        session.dialogData.indicador = results.response.entity;
        builder.Prompts.time(session, `¿De cuál fecha desea ${session.dialogData.opcion.toLowerCase()}?`);
    },
    function (session, results) {
        //buscar la forma de traducir los resultados a español
        session.dialogData.fecha = builder.EntityRecognizer.resolveTime([results.response]);

        let now = new Date();

        let fecha = session.dialogData.fecha;
        fecha.setHours(0);
        fecha.setMinutes(0);
        fecha.setSeconds(0);
        fecha.setMilliseconds(0);
        if (fecha.getTime() > now.getTime()) {
            session.endDialog(`Uff! desea predecir y ${session.dialogData.opcion.toLowerCase()} **${session.dialogData.indicador}**, 
        de la fecha **${session.dialogData.fecha.toDateString()}**`);
        } else {
            if (session.dialogData.opcion == 'Conocer valor de indicador') {
                RestClient.toKnowValue(session);
            } else {
                session.endDialog(`Trabajando para darte la comparación del valor del indicador 
                **${session.dialogData.indicador}** de la fecha **${session.dialogData.fecha.toDateString()}** 
                con respecto a la fecha actual`);
            }
        }
    }
]);
