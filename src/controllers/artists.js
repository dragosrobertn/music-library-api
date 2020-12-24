const { Artist } = require('../models');

    exports.create = (req, res) => {
        res.sendStatus(201).json(Artist);

        Artist.create(req.body).then(Artist => res.sendStatus(201).json(Artist));

    };




