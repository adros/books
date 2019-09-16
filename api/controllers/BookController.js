/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const dataUri = require('datauri').promise;

module.exports = {

    listExpanded: async function (req, res) {

        try {
            const client = sails.getDatastore().driver;
            const query = `SELECT b.id, b.title, b.original, b.pages, b.published, b.home, b.genre, b."pictureName",
                        json_agg((SELECT x FROM (SELECT r.year, r.id, r."totalOrder") AS x)) AS readings,
                        json_agg((SELECT x FROM (SELECT a."firstName", a.id, a."lastName") AS x)) AS authors,
                        json_agg((SELECT x FROM (SELECT s."title", s.id) AS x)) AS series
                      FROM public.book b
                      LEFT JOIN public.reading r ON b.id = r.book
                      LEFT JOIN public.author_books__book_authors ab ON b.id = ab.book_authors
                      LEFT JOIN public.author a ON a.id = ab.author_books
                      LEFT JOIN public.book_series__serie_books bs ON b.id = bs.book_series
                      LEFT JOIN public.serie s ON s.id = bs.serie_books
                      GROUP BY b.id;`;

            const result = await sails.getDatastore().sendNativeQuery(query, []);
            res.send(result.rows);
        } catch (e) {
            res.status(500).send(`Connection error: ${e.message}`);
        }
    },

    getImage: async function (req, res) {

        var book = await Book.findOne({ id: req.param('id').split('.')[0] }); //trim extension
        if (!book || !book.pictureUrl) {
            return res.status(404).send('book not found');
        }
        const [meta, data] = book.pictureUrl.split(',');
        const m = meta && meta.match(/data:(.*)+;base64/);
        if (!m) {
            res.status(500).send(`unknown meta: '${meta}'`);
        }
        res.set('Cache-Control', `max-age=${60 * 60 * 24 * 365}`)
            .type(m[1])
            .send(Buffer.from(data, 'base64'));
    }


};

