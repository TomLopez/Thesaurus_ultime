define(['marionette', 'backbone', 'modLanguage', 'config', 'growl', 'i18n'],
function(Marionette, Backbone, ModLanguage, config, Growl, I18n) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/language/tpl/tpl-languageManaging.html',
    className: 'language-page ns-full-height',
    events: {
      'click #validation': 'validation',
      'click #retour': 'retour',
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
      this.form = form;
      $('#languageContainer').append(form.el);
    },
    validation: function() {
      if(this.form.validate() == null){
        this.form.commit();
        this.language.save(null,{
          success: function(data){
            $.growl.notice({message: I18n.t('language_edit.success_message',{lng: data})});
            Backbone.history.navigate('#language', true);
          },
          error: function(){
            growl.error({message: I18n.t('language_edit.error_message',{lng: this.language.TLan_PK_Name})});
          }
        });
      }else{
        $.growl.error({message : "topic_field.empty_field"});
      }
    }
  });
});
