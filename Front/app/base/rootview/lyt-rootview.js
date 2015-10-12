define(['marionette',
  'backbone',
  'transitionRegion',
  'jquery',
  'jqueryui',
  '../../base/header/lyt-header'],
function(Marionette, Backbone, TransitionRegion, jQuery, ui, LytHeader) {
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
    render: function(options) {
      console.log('options',options);
      Marionette.LayoutView.prototype.render.apply(this, options);
      this.rgHeader.show(new LytHeader());
      var treevv = new TreeViewView();
      treevv.$el.appendTo($('#treeViewContainer'));
      treevv.render();
    },
  });
});
