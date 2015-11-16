define(['marionette',
  'backbone',
  'translater',
  'transitionRegion',
  'jquery',
  'jqueryui',
  '../../base/header/lyt-header',
  '../../base/tree/lyt-tree',
  'i18n',
  'config'],
function(Marionette, Backbone, Translater, TransitionRegion, jQuery, ui, LytHeader, LytTree,I18n,config) {
  'use strict';
  return Marionette.LayoutView.extend({
    el: 'body',
    template: 'app/base/rootview/tpl-rootview.html',
    className: 'ns-full-height',
    regions: {
      rgHeader: 'header',
      rgTree: '#rgTree',
      rgMain: 'main',
      rgFooter: 'footer',
    },
    initialize: function(options){
      this.options = options;
      this.translater = Translater.getTranslater();
    },
    onRender: function(options){
      this.$el.i18n();
    },
    render: function(options) {
      Marionette.LayoutView.prototype.render.apply(this, options);
      this.rgHeader.show(new LytHeader());
      var tree = new LytTree(this.options);
      tree.render();
      $('#rgTree').append(tree.el);
    },
  });
});
