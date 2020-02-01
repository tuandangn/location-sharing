const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(regionRouter);

app.listen(port, () => console.log(`Server is started at port ${port}`));