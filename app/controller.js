define(['marionette',
  'backbone',
  'config',
	'./base/home/lyt-home',
  './base/consultation/lyt-consultation',
  './base/modification/lyt-modification',
  './base/tree/lyt-tree',
  './base/creation/lyt-creation',
  './base/language/lyt-language',
  './base/language/lyt-languageManaging',
  'sweetAlert',
  'jquery',
  'jqueryui',
  'fancytree_menu',
  'fancytree_filter',
  'fancytree_dnd',
  'treeView',
], function(Marionette, Backbone, config,
	LytHome, LytConsultation, LytModification, LytTree,
  LytCreation, LytLanguage, LytLanguageManaging, swal,$,ui
) {
  'use strict';
  return Marionette.Object.extend({

    initialize: function() {
      this.rgTree = this.options.app.rootView.rgTree;
      this.rgMain = this.options.app.rootView.rgMain;
      this.rgHeader = this.options.app.rootView.rgHeader;
      this.rgFooter = this.options.app.rootView.rgFooter;
    },

    home: function(options) {
      this.rgMain.show(new LytHome());
    },
    consultation: function(options) {
      console.log('arguments',options);
      this.rgMain.show(new LytConsultation({key: options}));
    },
    modification: function(options) {
      console.log('arguments',options);
      if(this.options.app.user.get('status') == 'Administrateur' && config.isCore){
        this.rgMain.show(new LytModification({key: options}));
      }else{
        window.location = '#home';
      }
    },
    creation: function(options) {
      console.log('argumentscreation',options);
      if(this.options.app.user.get('status') == 'Administrateur' && config.isCore){
        this.rgMain.show(new LytCreation({key: options}));
      }else{
        window.location = '#home';
      }
    },
    suppression: function(options) {
      if(this.options.app.user.get('status') == 'Administrateur' && config.isCore){
        if(options){
          var theTree = $('#treeView').fancytree('getTree');
          var nodeToDelete = theTree.getNodeByKey(options);
          swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover the topic : ' + nodeToDelete.title + '!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: false
          },
          function() {
            $.ajax({
              type: 'DELETE',
              url: config.servUrl + 'topic/' + options
            }).error(function() {
              swal('TroubleShooting', 'An error occured during topic delete.');
            }).done(function() {
              nodeToDelete.remove();
              swal('Deleted!', 'Your topic has been deleted.', 'success');
            });

          });
        }
      }else{
        window.location = '#home';
      }
    },
    language: function(options){
      console.log('langage',options);
      if(this.options.app.user.get('status') == 'Administrateur' && config.isCore){
        this.rgMain.show(new LytLanguage({key: options}));
      }else{
        window.location = '#home';
      }
    },
    languageManage: function(options){
      console.log('langage',options);
      if(this.options.app.user.get('status') == 'Administrateur' && config.isCore){
        this.rgMain.show(new LytLanguageManaging({key: options}));
      }else{
        window.location = '#home';
      }
    },
    test: function(options){
      document.cookie ='ecoReleve-Core=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      console.log('document.cookieclear',document.cookie);
    }
  });
});
