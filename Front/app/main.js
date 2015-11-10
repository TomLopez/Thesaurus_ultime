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
    modTopicLibelle: './models/mod-topicLibelle',
    transitionRegion: './base/transition-region/transition-region',
    translater: 'translater',
    /*==========  Bower  ==========*/
    'requirejs-text': '../bower_components/requirejs-text/text',
    jquery: '../bower_components/jquery/jquery.min',
    jqueryui: '../bower_components/jqueryui/jquery-ui.min',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    backbone_forms: '../bower_components/backbone-forms/distribution.amd/backbone-forms.min',
    'backbone.list': '../bower_components/backbone-forms/distribution.amd/editors/list',
    marionette: '../bower_components/marionette/lib/core/backbone.marionette',
    'backbone.babysitter': '../bower_components/backbone.babysitter/' +
    'lib/backbone.babysitter',
    'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
    radio: '../bower_components/backbone.radio/build/backbone.radio',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
    sha1: '../bower_components/sha1/bin/sha1',
    i18n: '../bower_components/i18n/i18next',
    moment: '../bower_components/moment/min/moment.min',
    'jsrsasign': '../bower_components/jsrsasign/jsrsasign-latest-all-min',
    treeView: './vendors/Treeview_navbar_module',
    fancytree: './vendors/Fancytree/jquery.fancytree-all',
    fancytree_menu: './vendors/Fancytree/src/jquery.fancytree.menu',
    fancytree_dnd: './vendors/Fancytree/src/jquery.fancytree.dnd',
    fancytree_filter: './vendors/Fancytree/src/jquery.fancytree.filter',
    jquery182: './vendors/jquery-1.8.2',
    jqueryui182: './vendors/jquery-ui-1.8.24.min',
    sweetAlert: '../bower_components/sweetalert/lib/sweet-alert.min',
    listOfNestedModel: '../bower_components/nsBackbonesTools/ListOfNestedModel/ListOfNestedModel'
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
    listOfNestedModel: {
      deps: [
      'backbone',
      'backbone_forms'
      ]
    },
  },
  packages:[
  {
    name: 'listOfNestedModel',
    location: '../bower_components/nsBackbonesTools/ListOfNestedModel',
    main: 'listOfNestedModel'
  },
  ]
});

require(['app', 'templates','translater','config','jsrsasign'],
  function(app, templates, Translater, config) {
    var x = document.cookie;
  /*if(x.indexOf('ecoReleve-Core') != -1){
    console.log('document.cookie',document.cookie);
    var CookiePart = x.split(';');
    var token;
    $.each(CookiePart, function(index,value){
      console.log('arguments',arguments)
      if(value.indexOf('ecoReleve-Core') != -1){
        token = value.split('=')[1];
        return;
      }
    });
    var decodedHEad = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[0]));
    var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[1]));
    console.log('decodedHEad',decodedHEad);
    console.log('payloadObj',payloadObj);*/
    var userDatas;
    $.ajax({
      async: false,
      url: config.servUrl + 'Security/decode'
    }).done(function(data){
      userDatas = data;
    }).error(function(){
      alert("une erreur est survenue lors de l'accès au serveur");
    });
    console.log('userDatas', userDatas);
    if(userDatas != null && userDatas !== undefined){
      if(userDatas.Name !== undefined && userDatas.Name != ""){
        app.user = new Backbone.Model({
          user: userDatas.Name,
          language: userDatas.UserLanguage,
          //status: userDatas.RoleInThes,
        //status: 'Admin'
        status: 'SuperUser'
        //status: 'User'
      });
        this.translater = Translater.setTranslater(userDatas.UserLanguage.toLowerCase());
        setTimeout(function(){ app.start(); }, 0);
      }else{
        window.location=config.portalUrl;
      }
    }else{
      window.location=config.portalUrl;
    }
  });
