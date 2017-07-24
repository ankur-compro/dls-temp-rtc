#!/usr/bin/env node
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pubNub = require('pubnub');

//pubnub account: ankur.hsd@gmail.com
var publishKey = 'pub-c-1631356c-d7c0-4859-9330-bf399270feab',
    subscribeKey = 'sub-c-39a73d0c-7031-11e7-96c9-0619f8945a4f',
    secretKey = 'sec-c-NDMwNzdkYTMtMDliNi00OWY3LTkxMDUtNTBlOTkxYjFhNDI4';

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.post('/grant', function(req, res, next) {
  var reqBody = req.body;

  if(reqBody) {

    var pubnubAdminClient = new pubNub({
      publishKey: publishKey,
      subscribeKey: subscribeKey,
      secretKey: secretKey
    });

    var authKey = reqBody.user + Math.floor(Math.random() * 10000);
    pubnubAdminClient.grant({
      channels  : [ reqBody.room, reqBody.room + '-pnpres'],
      authKeys : [ authKey ],
      read     : true,
      write    : true,
      ttl      : 1000
    })
    .then(function(){
      res.send({ authKey: authKey });
    });
  } else {
    res.status(400).send({message: 'BAD REQUEST. CHECK PARAMS.'});
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({ message: err.message, error: err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({ message: err.message, error: {} });
});

app.set('port', process.env.PORT || 3100);

var server = app.listen(app.get('port'), function() {
  //debug('Express server listening on port ' + server.address().port);
  console.log('Express server listening on port ' + server.address().port);
  console.log('started');
});
