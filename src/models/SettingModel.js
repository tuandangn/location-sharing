const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

//setting file
const _targetFile = path.join(process.cwd(), 'settings.json');

class SettingModel {
    constructor(file) {
        this.file = file;

        //model
        const _schema = new mongoose.Schema({
            name: String,
            value: String
        });
        this.Model = mongoose.model('Settings', _schema);
    }

    clear() {
        return new Promise((resolve, reject) => {
            this.Model.deleteMany({}, (err) => {
                if (err)
                    return reject(err);
                resolve(true);
            });
        });
    }

    isEmpty() {
        return new Promise((resolve, reject) => {
            this.Model.exists({}, (err, settings) => {
                if (err)
                    return reject(err);
                resolve(settings.length == 0);
            })
        });
    }

    _readFromFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.file, 'utf-8', (err, data) => {
                if (err)
                    return reject(err);
                const settingData = JSON.parse(data);
                resolve(settingData);
            });
        });
    }

    init(force = false) {
        return new Promise((resolve, reject) => {
            const firstTask = force ? this.clear() : this.isEmpty();
            firstTask.then((start) => {
                if (start) {
                    this._readFromFile().then((settingData) => {
                        const settings = [];
                        for (const prop in settingData) {
                            settings.push(new this.Model({ name: prop, value: settingData[prop] }));
                        }
                        this.Model.insertMany(settings, (err, docs) => {
                            if (err)
                                return reject(err);
                            resolve(docs);
                        });
                    })
                } else {
                    resolve();
                }
            });
        });
    }
}

//export
module.exports = new SettingModel(_targetFile);