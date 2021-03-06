/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //'/': { view: 'pages/homepage' },

  'get /svc/author/image/:id': {
    controller: 'author',
    action: 'getImage',
    skipAssets: false
  },

  'get /svc/author/list/': {
    controller: 'author',
    action: 'listExpanded'
  },

  'get /svc/book/image/:id': {
    controller: 'book',
    action: 'getImage',
    skipAssets: false
  },

  'get /svc/book/list/': {
    controller: 'book',
    action: 'listExpanded'
  },

  'get /svc/author/:id/book/list/': {
    controller: 'book',
    action: 'listExpandedByAuthor'
  },

  'get /svc/reading/list/': {
    controller: 'reading',
    action: 'listExpanded'
  },

  'get /svc/reading/stats/': {
    controller: 'reading',
    action: 'listStats'
  },

  'get /svc/search/': {
    controller: 'search',
    action: 'search'
  },
  

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
