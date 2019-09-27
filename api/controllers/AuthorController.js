const dataUri = require('datauri').promise;
const _ = require('lodash');

const controller = module.exports = {

    listExpanded: async function (req, res) {
        try {
            res.send(await controller._getAuthors());
        } catch (e) {
            res.status(500).send(`Error: ${e.message}`);
        }
    },

    _getAuthors: async function (where, params) {
        const query = `SELECT a.id, a."lastName", a."firstName", a."dateOfBirth", a."dateOfDeath", a."pictureName", a.link, a.nationality,
                          json_agg((SELECT x FROM (SELECT r.id) AS x)) AS readings,
                          json_agg((SELECT x FROM (SELECT b.id) AS x)) AS books
                        FROM public.author a
                        LEFT JOIN public.author_books__book_authors ab ON a.id = ab.author_books
                        LEFT JOIN public.book b ON b.id = ab.book_authors
                        LEFT JOIN public.reading r ON b.id = r.book
                        ${where || ''} 
                        GROUP BY a.id ORDER BY a.id`;

        return (await sails.getDatastore().sendNativeQuery(query, params || []))
            .rows
            .map((item, idx) => {
                item.booksInDb = _.uniqBy(item.books, 'id').length
                item.readBooks = _.uniqBy(item.readings, 'id').length
                delete item.readings;
                delete item.books;
                return item;
            });
    },

    getImage: async function (req, res) {

        var author = await Author.findOne({ id: req.param('id').split('.')[0] }); //trim extension
        if (!author || !author.pictureUrl) {
            return res.status(404).send('author not found');
        }
        const [meta, data] = author.pictureUrl.split(',');
        const m = meta && meta.match(/data:(.*)+;base64/);
        if (!m) {
            res.status(500).send(`unknown meta: '${meta}'`);
        }
        res.set('Cache-Control', `max-age=${60 * 60 * 24 * 365}`)
            .type(m[1])
            .send(Buffer.from(data, 'base64'));
    }

};

