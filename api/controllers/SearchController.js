const { removeDiacriticalMarks } = require('../common/remove-diacritical-marks');

const controller = module.exports = {

    search: async function (req, res) {
        if (!req.query.search) {
            res.send([]);
        }
        try {
            res.send(await controller._search(req.query.search));
        } catch (e) {
            res.status(500).send(`Error: ${e.message}`);
        }
    },

    _search: async function (search) {
        const params = search.split(/\s/).filter(Boolean).map((s) => `%${removeDiacriticalMarks(s).toUpperCase()}%`);
        var [
            [booksByTitle, booksByTitleCount],
            [booksByOriginal, booksByOriginalCount],
            [authors, authorsCount]
        ] = await Promise.all([
            this._searchBooksByTitle(params),
            this._searchBooksByOriginal(params),
            this._searchAuthors(params)
        ]);

        return { booksByTitle, booksByOriginal, booksByTitleCount, booksByOriginalCount, authors, authorsCount };
    },

    _searchBooksByTitle: function (params) {
        const where = params.map((p, i) => `"titleSearch" LIKE \$${i + 1}`).join(' AND ');
        const query = `SELECT title, id FROM public.book WHERE ${where} ORDER BY title LIMIT 5`;
        const countQuery = `SELECT COUNT(*) FROM public.book WHERE ${where}`;

        return Promise.all([
            sails.getDatastore().sendNativeQuery(query, params).then(({ rows }) => rows),
            sails.getDatastore().sendNativeQuery(countQuery, params).then(({ rows }) => rows[0].count)
        ]);
    },

    _searchBooksByOriginal: function (params) {
        const where = params.map((p, i) => `"originalSearch" LIKE \$${i + 1}`).join(' AND ');
        const query = `SELECT original, id FROM public.book WHERE ${where} ORDER BY original LIMIT 5`;
        const countQuery = `SELECT COUNT(*) FROM public.book WHERE ${where}`;

        return Promise.all([
            sails.getDatastore().sendNativeQuery(query, params).then(({ rows }) => rows),
            sails.getDatastore().sendNativeQuery(countQuery, params).then(({ rows }) => rows[0].count)
        ]);
    },

    _searchAuthors: function (params) {
        const where = params.map((p, i) => `("lastNameSearch" LIKE \$${i + 1} OR "firstNameSearch" LIKE \$${i + 1})`).join(' AND ');
        const query = `SELECT "lastName", "firstName", id FROM public.author WHERE ${where} ORDER BY "lastName" LIMIT 5`;
        const countQuery = `SELECT COUNT(*) FROM public.author WHERE ${where}`;

        return Promise.all([
            sails.getDatastore().sendNativeQuery(query, params).then(({ rows }) => rows),
            sails.getDatastore().sendNativeQuery(countQuery, params).then(({ rows }) => rows[0].count)
        ]);
    }
};

