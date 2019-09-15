/**
 * ReadingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  listExpanded: async function (req, res) {

    const client = sails.getDatastore().driver;

    try {
      let query = `
        SELECT *
          FROM public.book b
        LEFT OUTER JOIN public.author_books__book_authors ab
          ON b._id = ab.book_authors
        LEFT OUTER JOIN public.author a
          ON ab.author_books = a._id`;

      query = `select json_agg(books)
              from (
                select title from public.book
              ) as books`;

      query = `select row_to_json(xxx) as yyy
                from(
                  select b.title,
                  (select json_agg(reading)
                  from (
                    select year from public.reading where book = b._id
                  ) reading
                ) as reading
                from public.book as b) xxx`;

      query = `select b.title,
              (select json_agg(reading)
                from (
                  select year from public.reading where book = b._id
                ) reading
              ) as reading
              from public.book as b`;

      const result = await sails.getDatastore().sendNativeQuery(query, []);

      //       `select row_to_json(rea) as reading
      // from(
      //   select a.id, a.name,
      //   (select json_agg(alb)
      //   from (
      //     select * from albums where artist_id = a.id
      //   ) alb
      // ) as albums
      // from artists as a) art;`

      // const result = await sails.getDatastore().sendNativeQuery(`
      //   SELECT * FROM public.author`, []);
      res.send(result.rows);
    } catch (e) {
      res.status(500).send(`Connection error: ${e.message}`);
    }
  }

};

