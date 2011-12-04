console.log("Running environment: " + process.env.NODE_ENV);

// Loads the application.
var app = require("./src");

// Run
app.listen(3000);

