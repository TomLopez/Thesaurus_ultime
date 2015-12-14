define(['marionette', 'backbone', 'backbone_forms',
  'listOfNestedModel','modTopic', 'modTopicLibelle','config', 'i18n'],
function(Marionette, Backbone, BackboneForm, ListOfNestedModel, ModTopic, ModTopicLibelle, config) {
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
        //var topicLibelle = new ModTopicLibelle();
       /* topicLibelle.set({
          TLib_FK_TLan_ID : 'en'
        });*/
        //topicLibelle.data = {TLib_FK_TLan_ID: 'en'};
        //console.log("topicLibelle.schema",topicLibelle.schema)
        //topicLibelle.schema.TLib_FK_TLan_ID.options = [{icon: null, label: 'English', val: 'en'}];
        topic.set({
          TTop_ParentID: topicParent.get('TTop_PK_ID'),
          TTop_FullPath: topicParent.get('TTop_FullPath'),
          TTop_Type: topicParent.get('TTop_Type'),
          TTop_Date: Date.now(),
          TTop_BranchOrder: topicParent.get('TTop_BranchOrder'),
          //TTopicLibelle : [topicLibelle]
        });
        //topic.data = {TTopicLibelle : {TLib_FK_TLan_ID: 'en'}}
        //topic.schema.TTopicLibelle.subschema.TLib_FK_TLan_ID.options = [{icon: null, label: 'English', val: 'en'}];
        this.topic = topic;
        console.log('parent',topicParent);
        console.log('child',topic);

      }else {
        this.topic = new ModTopic();
        var topicLibelle = new ModTopicLibelle();
        topicLibelle.set({
          TLib_FK_TLan_ID : 'en'
        });
        this.topic.set({TTopicLibelle:[topicLibelle]});
      }
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
      console.log('this.topic',this.topic);
      this.form.commit();
      this.topic.save(null,{
        success: function(data) {
          console.log('save_this',data)
          var tree = $('#' + config.treeDivId).fancytree('getTree');
          var parentNode;
          if(_this.topic.attributes.TTop_ParentID != null && _this.topic.attributes.TTop_ParentID != '') {
            parentNode = tree.getNodeByKey(_this.topic.attributes.TTop_ParentID);
          }else {
            parentNode = tree.getRootNode();
          }
          console.log('theparent', parentNode);
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
          /*topicLibelle.set({
            TLib_FK_TLan_ID: 'en',
            TLib_Name: $('#en_TLib_Name'),
            TLib_Definition: $('#en_TLib_Definition'),
            TLib_FK_TTop_ID: data.id
          });*/
          topicLibelle.save({
            TLib_FK_TLan_ID: 'en',
            TLib_Name: $('#en_TLib_Name').val(),
            TLib_Definition: $('#en_TLib_Definition').val(),
            TLib_FK_TTop_ID: data.id
          });
        }
      });
    },
    retour: function(){

    }
  });
});
