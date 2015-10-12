require.config({
  baseUrl: 'app',
  paths: {

    tmp: './tmp',

    app: 'app',
    config: 'config',
    router: 'router',
    controller: 'controller',
    models: './models',
    collections: './collections',
    templates: '../build/templates',
    lytRootview: './base/rootview/lyt-rootview',
    modTopic: './models/mod-topic',
    modLanguage: './models/mod-language',
    transitionRegion: './base/transition-region/transition-region',
    translater: 'translater',
    /*==========  Bower  ==========*/
    jquery: '../bower_components/jquery/jquery.min',
    jqueryui: '../bower_components/jqueryui/jquery-ui.min',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    backboneForms: '../bower_components/backbone-forms/distribution.amd/backbone-forms.min',
    marionette: '../bower_components/marionette/lib/core/backbone.marionette',
    'backbone.babysitter': '../bower_components/backbone.babysitter/' +
    'lib/backbone.babysitter',
    'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
    radio: '../bower_components/backbone.radio/build/backbone.radio',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
    sha1: '../bower_components/sha1/bin/sha1',
    i18n: '../bower_components/i18n/i18next',
    moment: '../bower_components/moment/min/moment.min',
    treeView: './vendors/Treeview_navbar_module',
    fancytree: './vendors/Fancytree/jquery.fancytree-all',
    fancytree_menu: './vendors/Fancytree/src/jquery.fancytree.menu',
    fancytree_dnd: './vendors/Fancytree/src/jquery.fancytree.dnd',
    fancytree_filter: './vendors/Fancytree/src/jquery.fancytree.filter',
    jquery182: './vendors/jquery-1.8.2',
    jqueryui182: './vendors/jquery-ui-1.8.24.min',
    sweetAlert: '../bower_components/sweetalert/lib/sweet-alert.min'
  },

  shim: {
    jquery: {
      exports: '$',
    },
    jquery182: {
      exports: '$',
    },
    jqueryui: {
      exports: 'ui',
    },
    jqueryui182: {
      deps: ['jquery182'],
      exports: 'ui',
    },
    underscore: {
      exports: '_',
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone',
    },
    marionette: {
      exports: 'Marionette',
    },
    radio: {
      exports: 'Radio',
    },
    bootstrap: {
      deps: ['jquery'],
      exports: 'Bootstrap',
    },
    templates: {
      deps: ['underscore'],
      exports: 'Templates',
    },
    sha1: {
      exports: 'sha1',
    },
    moment: {
      exports: 'moment',
    },
    fancytree: {
      deps: ['jquery','jqueryui','backbone']
    },
    treeView: {
      deps: ['fancytree'],//'fancytree_filter','fancytree_menu','fancytree_dnd'],
    },
    fancytree_menu: {
      deps: ['fancytree'],
    },
     fancytree_filter: {
      deps: ['fancytree'],
    },
     fancytree_dnd: {
      deps: ['fancytree'],
    },
    i18n: {
      deps: ['jquery'],
      exports: '$',
    },
  },
});

require(['app', 'templates','translater'],
function(app, templates, Translater) {
  app.start();
  this.translater = Translater.getTranslater();
});
