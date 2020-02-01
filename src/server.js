const https = require('https'),
    fs = require('fs'),
    join = require('path').join,
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    helmet = require('helmet');

//config
require('dotenv').config();

//routes
const regionRouter = require('./routes/regionRouter');

//db
if (!process.env.DB) {
    console.error('Database configuration is not found');
    return;
}
mongoose.connect(process.env.DB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', function () {
    console.log('Database connected');
    const setting = require('./models/SettingModel');
    const reload = process.env.RELOAD_SETTINGS;
    setting.init(reload).then(() => console.log(`Settings loaded`));
});

//app
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(regionRouter);

//ssl
const options = {
    key: fs.readFileSync(join(process.cwd(), 'ssl/cert.key')),
    cert: fs.readFileSync(join(process.cwd(), 'ssl/cert.pem'))
};

//server
const port = process.env.PORT || 3000;
https
    .createServer(options, app)
    .listen(port, () => console.log(`Server is started at port ${port}`));