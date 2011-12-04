
/** Top-level application namespace. */
App = {};

// Loads components and dependencies.
Object.extend(global, require("prototype"));

var express = require("express");

require("./util/IO");
var Junar = require("junar");
App.io.requireDir(__dirname + "/util/");

// Creates the appserver.
var app = express.createServer();

// Extends global object.
global.Server = app;
App.Junar = Junar.create({
  authKey : "8c713041e3734b7b8b18ed1db249880d7d4c1f6d"
});

// Sets up the database.
require("./database");

// Includes application sources.
App.io.requireDir(__dirname + "/domain/");
App.io.requireDir(__dirname + "/application/");
App.io.requireDir(__dirname + "/filter/");

// Configures the rendering engine.
app.set('view engine', 'mustache')
app.set("views", __dirname + '/view');
app.register(".html", require('stache'));

// Maps static resources.
app.use("/asset", express.static(__dirname + '/view/asset'));

// General configuration.
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(app.router);
});


// General configuration.
app.configure("dev", function() {
  setTimeout(function() {
    Model.setupRelationships();
    Model.sync({ force : true }).on("success", function() {
      require("./data." + process.env.NODE_ENV.toLowerCase() + ".js");
    }).on("failure", function(error) {
      console.log(error);
    });
  }, 0);
});

module.exports = {
  listen : function(port) {
    app.listen(port);
    console.log('Application running on port ' + port)
  }
};

