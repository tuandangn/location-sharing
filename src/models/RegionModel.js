const mongoose = require('mongoose');

class RegionModel {
    constructor() {
        //schema
        const _schema = new mongoose.Schema({
            name: String,
            date: { type: Date, default: Date.now },
            deleted: { type: Boolean, default: false }
        });
        this.Model = mongoose.model("Regions", _schema);
    }

    instance({ name }) {
        const model = new this.Model({ name: name });
        return model;
    }

    getAll(page = 0) {
        if (page < 0) throw new Error('Page is not less than 0');

        const pageCount = 2;
        return this.Model
            .find()
            .where("deleted").equals(false)
            .sort("-date")
            .skip(pageCount * page)
            .limit(pageCount)
            .select("_id name date")
            .exec();
    }

    create(model) {
        return this.Model
            .create(model)
            .then(({ _id, name, date }) => { _id, name, date });
    }

    async delete(model) {
        model.deleted = true;
        await model.save();
    }

    findById(id){
        return this.Model.findById(id);
    }
}

//exports
module.exports = new RegionModel();