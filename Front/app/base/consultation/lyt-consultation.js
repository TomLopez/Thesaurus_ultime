define(['marionette', 'backbone', 'modTopic', 'config', 'i18n'],
function(Marionette, Backbone, ModTopic, config) {
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
      console.log(this);
      /*this.userLanguage =*/
      this.topic = topic;
    },

    serializeData: function(){
      return {
        topic: this.topic.attributes,
        refLangue: config.refLanguage,
        langue: this.model.attributes.language
      };
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
      this.$el.i18n();
    },
  });
});
