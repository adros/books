/**
 * AuthorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const dataUri = require('datauri').promise;

module.exports = {

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

