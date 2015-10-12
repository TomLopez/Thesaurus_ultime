define(['marionette', 'backbone', 'modLanguage', 'config', 'i18n'],
function(Marionette, Backbone, ModLanguage, config) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/language/tpl/tpl-language.html',
    className: 'consultation-page ns-full-height',
    events: {
    },

    initialize: function(options) {
      this.options = options;
      this.model = window.app.user;
      console.log('languageOptions',options);
      if (!options.key) {
      var LanguageColl = Backbone.Collection.extend({
        url: config.servUrl + 'language',
        model: ModLanguage,
        initialize: function() {
          this.fetch({
            async:false,
            success: this.fetchSuccess,
            error: this.fetchError
          });
        },
        fetchSuccess: function(collection, response) {
          console.log('Collection fetch success', response);
          console.log('Collection models: ', collection.models);
        },
      });
        var languages = new LanguageColl();
        languages.fetch({
          //async: false,
        });
        this.languages = languages;
      }else{
        var languages = new ModLanguage({id: options.key});
        languages.fetch({
          async:false,
        });
        this.languages = languages;
      }
      /*var topic = new ModTopic({id:options.key});
      topic.fetch({async:false});
      this.topic = topic;*/
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
      var _this = this;
      var LanguageChildView = Backbone.Marionette.ItemView.extend({
        template: 'app/base/language/tpl/tpl-oneLanguage.html',
        events:{
          'click .btn': 'goManage'
        },
        serializeData: function(data) {
          if (!_this.options.key) {
            var data = this.model.attributes;
          }else {
            var data = this.collection.attributes;
          }
          return data;
        },
        goManage: function(e){
          if (this.model) {
            app.router.navigate('#language/manage/' + this.model.attributes.TLan_PK_Name,{trigger: true});
          }else {
            app.router.navigate('#language/manage/' + this.collection.attributes.TLan_PK_Name,{trigger: true});
          }
        }
      });
      if (this.options.key) {
        var vue = new LanguageChildView({collection: this.languages});
        vue.render();
        this.$el.find('#languageContainer').append(vue.el);
      }else {
        var LanguageCollectionView = Backbone.Marionette.CollectionView.extend({
          //tagName: 'ul',
          childView: LanguageChildView,
          childViewContainer: '#allLanguages',
          template: 'app/base/home/tpl/tpl-languagesContainer.html',
          serializeData: function(){
            var data = this.model.toJSON();
            return data;
          }
        });
        var languageCollView = new LanguageCollectionView({collection: this.languages});
        languageCollView.render();
        this.$el.find('#languageContainer').append(languageCollView.el);
      }
      //}else{

      //}
    },
  });
});
