
define(['marionette', 'backbone', 'moment',
  './base/rootView/lyt-rootview', 'router',
   'controller', 'config', 'translater', 'i18n'],
   function(
    Marionette, Backbone, moment, LytRootview, Router,
    Controller, config, Translater) {

     var app = {};
     var JST = window.JST = window.JST || {};

     Backbone.Marionette.Renderer.render = function(template, data) {
       if (!JST[template]) throw 'Template \'' + template + '\' not found!';
       return JST[template](data);
     };

     app = new Marionette.Application();

     app.on('start', function() {
       /*app.user = new Backbone.Model({
             user: 'Admin User',
             language: 'fr'
           });*/
       app.translater = Translater.setTranslater({lng:app.user.get('language')});
       app.rootView = new LytRootview({options : app.user.get('language')});
       app.controller = new Controller({app: app});
       app.router = new Router({controller: app.controller, app: app});
       app.rootView.render();
       //this.rootView.$el.i18n({lng: app.user.get('language')});
       Backbone.history.start();
     });

     $(document).ajaxStart(function(e) {
       $('#header-loader').removeClass('hidden');
     });

     $(document).ajaxStop(function() {
       $('#header-loader').addClass('hidden');
     });

     window.app = app;
     console.log(window);
     return app;
   });
