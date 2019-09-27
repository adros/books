const dataUri = require('datauri').promise;
const _ = require('lodash');

const controller = module.exports = {

  listExpanded: async function (req, res) {
    try {
      res.send(await controller._getBooks());
    } catch (e) {
      res.status(500).send(`Error: ${e.message}`);
    }
  },

  listExpandedByAuthor: async function (req, res) {
    try {
      res.send(await controller._getBooks(`WHERE a.id=$1`, [req.param('id')]));
    } catch (e) {
      res.status(500).send(`Error: ${e.message}`);
    }
  },

  _getBooks: async function (where, params) {
    const query = `SELECT b.id, b.title, b.original, b.pages, b.published, b.home, b.genre, b."pictureName", b.description,
                      json_agg((SELECT x FROM (SELECT r.year, r.id, r."totalOrder") AS x)) AS readings,
                      json_agg((SELECT x FROM (SELECT a."firstName", a.id, a."lastName", ab.id as relid) AS x)) AS authors,
                      json_agg((SELECT x FROM (SELECT s."title", s.id) AS x)) AS series
                    FROM public.book b
                    LEFT JOIN public.reading r ON b.id = r.book
                    LEFT JOIN public.author_books__book_authors ab ON b.id = ab.book_authors
                    LEFT JOIN public.author a ON a.id = ab.author_books
                    LEFT JOIN public.book_series__serie_books bs ON b.id = bs.book_series
                    LEFT JOIN public.serie s ON s.id = bs.serie_books
                    ${where || ''} 
                    GROUP BY b.id ORDER BY b.id`;

    return (await sails.getDatastore().sendNativeQuery(query, params || []))
      .rows
      .map((item, idx) => {
        if (item.authors.length > 1) {
          item.authors = _.orderBy(_.uniqBy(item.authors, 'id'), 'relid');
        }
        if (item.readings.length > 1) {
          item.readings = _.orderBy(_.uniqBy(item.readings, 'id'), 'totalOrder');
        }
        item.series = item.series.filter(({ id }) => !!id);
        if (item.series.length > 1) {
          item.series = _.orderBy(_.uniqBy(item.series, 'id'), 'id'); // there are some null itms?
        }
        item.hasImage = !!item.pictureName;
        item.hasDescription = !!item.description;
        delete item.description;
        item.order = idx + 1;
        return item;
      });
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

