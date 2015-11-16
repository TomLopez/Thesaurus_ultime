/**

  TODO:
  - set login as marionette.application

**/
define(['jquery', 'marionette', 'backbone', 'config',
  './base/header/lyt-header',],
  function($, Marionette, Backbone, config) {

'use strict';
return Marionette.AppRouter.extend({
  appRoutes: {
    'consultation(/:id)': 'consultation',
    'modification(/:id)': 'modification',
    'creation(/:id)': 'creation',
    'creation': 'creation',
    'suppression(/:id)': 'suppression',
    'language(/:id)': 'language',
    'language': 'language',
    'language/manage(/:id)': 'languageManage',
    'language/manage': 'languageManage',
    'test':'test',
    '*route(/:page)': 'home'
  },
});
});
