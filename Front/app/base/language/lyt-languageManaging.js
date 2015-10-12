define(['marionette', 'backbone', 'modLanguage', 'config', 'i18n'],
function(Marionette, Backbone, ModLanguage, config) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/language/tpl/tpl-languageManaging.html',
    className: 'language-page ns-full-height',
    events: {
    },

    initialize: function(options) {
      this.options = options;
      this.model = window.app.user;
      console.log('languageOptions',options);
      if (this.options.key) {
        var language = new ModLanguage({id: this.options.key});
        language.fetch({
          async: false
        });
        this.language = language;
        console.log('language',language);
      }
    },

    serializeData: function(){
      //return {topic : this.topic.attributes};
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
      var form = new Backbone.Form({
          model: this.language
      }).render();
      $('#languageContainer').append(form.el);
    },
  });
});
