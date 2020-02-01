const RegionModel = require('../models/RegionModel');

class RegionController {
    constructor(Model) {
        this.Model = Model;
    }

    async getAll(req, res) {
        const page = parseInt(req.query.page) || 0;

        let allRegions = await this.Model.getAll(page);
        if (allRegions == null) {
            allRegions = [];
        }

        res.json(allRegions);
    }

    async create(req, res) {
        let model = this.Model.instance(req.body);

        model = await this.Model.create(model);

        res.json(this.createdModel);
    }

    async delete(req, res) {
        const id = req.params.id;
        const model = await this.Model.findById(id);
        if (model != null) {
            await this.Model.delete(model);
        }

        res.sendStatus(200);
    }

    async getById(req, res) {
        const id = req.params.id;
        const model = await this.Model.findById(id);

        if (model == null) {
            return res.json(null);
        }

        const { _id, name, date } = model;
        res.json({ _id, name, date });
    }
}

//exports
module.exports = new RegionController(RegionModel);