
define(['marionette', 'backbone', 'moment',
  './base/rootView/lyt-rootview', 'router',
   'controller', 'config'],
   function(
    Marionette, Backbone, moment, LytRootview, Router,
    Controller, config) {

     var app = {};
     var JST = window.JST = window.JST || {};

     Backbone.Marionette.Renderer.render = function(template, data) {
       if (!JST[template]) throw 'Template \'' + template + '\' not found!';
       return JST[template](data);
     };

     app = new Marionette.Application();

     app.on('start', function() {
       app.rootView = new LytRootview();
       app.rootView.render();
       app.controller = new Controller({app: app});
       app.router = new Router({controller: app.controller, app: app});
       app.user = new Backbone.Model({
             user: 'Admin User',
           });
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
