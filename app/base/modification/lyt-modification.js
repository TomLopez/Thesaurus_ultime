define(['marionette',
  'backbone',
  'translater',
  'modTopic',
  'modTopicLibelle',
  'backbone_forms',
  'listOfNestedModel',
  'config',
  'i18n'],
function(Marionette, Backbone, Translater, ModTopic, modTopicLibelle, BackboneForm, ListOfNestedModel, config) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/modification/tpl/tpl-modification.html',
    className: 'modification-page ns-full-height',
    events: {
      'click #validation': 'validation',
      'click #retour': 'retour',
    },

    initialize: function(options) {
      this.options = options;
      this.model = window.app.user;
      var topic = new ModTopic({id: options.key});
      topic.fetch({async: false});
      this.topic = topic;
    },

    serializeData: function() {
      return {topic: this.topic.attributes};
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
          model: this.topic
      }).render();
      this.form = form;
      $('#topicContainer').append(form.el);
      this.$el.i18n();
    },
    validation:function() {
      var _this = this;
      console.log('thisModifTopic', this.topic);
      var testGege = this.form.commit();
      console.log('testGege',testGege);
      this.topic.save(null,{
        success: function() {
          var tree = $('#' + config.treeDivId).fancytree('getTree');
          var nodeToUpdate = tree.getNodeByKey(_this.topic.id);
          nodeToUpdate.setTitle(_this.topic.attributes.TTop_Name);
        }
      });
    },
    retour: function() {

    }
  });
});
