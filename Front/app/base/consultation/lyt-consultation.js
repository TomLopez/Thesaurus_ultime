define(['marionette', 'backbone', 'modTopic', 'i18n'],
function(Marionette, Backbone, ModTopic) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/consultation/tpl/tpl-consultation.html',
    className: 'consultation-page ns-full-height',
    events: {
    },

    initialize: function(options) {
      this.options = options;
      this.model = window.app.user;
      var topic = new ModTopic({id:options.key});
      topic.fetch({async:false});
      this.topic = topic;
    },

    serializeData: function(){
      return {topic : this.topic.attributes};
    },

    animateIn: function() {
      this.$el.find('#schtroudel').animate(
      {opacity: 1},
      500,
      _.bind(this.trigger, this, 'animateIn')
      );
    },

    // Same as above, except this time we trigger 'animateOut'
    animateOut: function() {
      this.$el.find('#tiles').removeClass('zoomInUp');
      this.$el.animate(
      {opacity: 0},
      500,
      _.bind(this.trigger, this, 'animateOut')
      );
    },

    onShow: function(options) {

    },
  });
});
