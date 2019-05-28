var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

var PORT = process.env.PORT || 8081;
var db = require('./models');

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static folder
app.use(express.static('public'));

// view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log('app listening on port: ' + PORT);
  });
});
