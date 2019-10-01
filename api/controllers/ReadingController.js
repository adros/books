const _ = require('lodash');

const controller = module.exports = {
    listExpanded: async function (req, res) {
        try {
            res.send(await controller._getReadings());
        } catch (e) {
            res.status(500).send(`Error: ${e.message}`);
        }
    },

    listStats: async function (req, res) {
        try {
            res.send(await controller._getReadingsStats());
        } catch (e) {
            res.status(500).send(`Error: ${e.message}`);
        }
    },

    _getReadings: async function (where, params) {
        const query = `SELECT r.year, r.id, r."totalOrder", r."yearOrder", b.id as bookId, b.title, b.pages, b."pictureName",
                          json_agg((SELECT x FROM (SELECT a."firstName", a.id, a."lastName", ab.id as relid) AS x)) AS authors
                        FROM public.reading r
                        LEFT JOIN public.book b ON b.id = r.book
                        LEFT JOIN public.author_books__book_authors ab ON b.id = ab.book_authors
                        LEFT JOIN public.author a ON a.id = ab.author_books
                        ${where || ''} 
                        GROUP BY r.id, b.id ORDER BY r.id`;

        return (await sails.getDatastore().sendNativeQuery(query, params || []))
            .rows
            .map((item, idx) => {
                if (item.authors.length > 1) {
                    item.authors = _.orderBy(_.uniqBy(item.authors, 'id'), 'relid');
                }
                return item;
            });
    },

    _getReadingsStats: async function (where, params) {
        const query = `SELECT r.year, b.pages
                        FROM public.reading r
                        LEFT JOIN public.book b ON b.id = r.book
                        GROUP BY r.id, b.id ORDER BY r."totalOrder"`;

        return (await sails.getDatastore().sendNativeQuery(query, params || []))
            .rows;
    },
};

