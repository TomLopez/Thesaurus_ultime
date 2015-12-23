define(['marionette', 'backbone', 'backbone_forms',
  'listOfNestedModel','modTopic', 'modTopicLibelle','config', 'i18n', 'growl'],
function(Marionette, Backbone, BackboneForm, ListOfNestedModel, ModTopic, ModTopicLibelle, config, I18n) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/creation/tpl/tpl-creation.html',
    className: 'consultation-page ns-full-height',
    events: {
      'click #validation': 'validation',
      'click #retour': 'retour',
    },

    initialize: function(options) {
      this.options = options;
      this.model = window.app.user;
      if (options.key) {
        var topicParent = new ModTopic({id: options.key});
        topicParent.fetch({async: false});
        var topic = new ModTopic();
        topic.set({
          TTop_ParentID: topicParent.get('TTop_PK_ID'),
          TTop_FullPath: topicParent.get('TTop_FullPath'),
          TTop_Type: topicParent.get('TTop_Type'),
          TTop_Date: Date.now(),
          TTop_BranchOrder: topicParent.get('TTop_BranchOrder'),
        });
      }else {
        var topic = new ModTopic();
        topic.set({
          TTop_ParentID:null,
          TTop_Date: Date.now()
        });
      }
      this.topic = topic;
    },

    serializeData: function() {
      if (this.topic) {
        return {topic: this.topic.attributes};
      }
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

      console.log('zgueg',$('#TLib_FK_TLan_ID').val('en'));
    },
    validation: function() {
      var _this = this;
      if(this.form.validate() == null){
        this.form.commit();
        this.topic.save(null,{
          success: function(data) {
            var tree = $('#' + config.treeDivId).fancytree('getTree');
            var parentNode;
            if(_this.topic.attributes.TTop_ParentID != null && _this.topic.attributes.TTop_ParentID != '') {
              parentNode = tree.getNodeByKey(_this.topic.attributes.TTop_ParentID);
            }else {
              parentNode = tree.getRootNode();
            }
            parentNode.addChildren({
              title: _this.topic.attributes.TTop_Name,
              key: _this.topic.id,
              data: {
                deprecated: false,
                fullpath: _this.topic.attributes.TTop_FullPath,
                fullpathTranslated: null,
                value: _this.topic.attributes.TTop_Name,
                valueTranslated: null,
              }
            });
            parentNode.setExpanded(true);
            var topicLibelle = new ModTopicLibelle();
            topicLibelle.save({
              TLib_FK_TLan_ID: 'en',
              TLib_Name: $('#en_TLib_Name').val(),
              TLib_Definition: $('#en_TLib_Definition').val(),
              TLib_FK_TTop_ID: data.id
            });
          }
        });
      }else{
        $.growl.error({message: I18n.t("topic_field.empty_field")});
      }
    },
    retour: function(){

    }
  });
});
