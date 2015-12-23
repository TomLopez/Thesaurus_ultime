define(['marionette',
  'backbone',
  'translater',
  'modTopic',
  'modTopicLibelle',
  'backbone_forms',
  'listOfNestedModel',
  'config',
  'i18n',
  'growl',
  'i18n'],
function(Marionette, Backbone, Translater, ModTopic, modTopicLibelle, BackboneForm, ListOfNestedModel, config, I18n, growl) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: 'app/base/modification/tpl/tpl-modification.html',
    className: 'modification-page ns-full-height',
    events: {
      'click #validation': 'validation',
      'click #retour': 'retour',
      'change select[id=TAtt_Type]':'changeForFile',
      'focus select[id=TAtt_Type]':'testForFile'
    },

    initialize: function(options) {
      this.options = options;
      this.model = window.app.user;
      var topic = new ModTopic({id: options.key});
      topic.fetch({async: false});
      this.topic = topic;
      var form = new Backbone.Form({
        model: this.topic
      }).render();
      this.form = form;
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
      $('#topicContainer').append(this.form.el);
      this.$el.i18n();
    },
    onRender:function(){
    },
    validation: function() {
      var _this = this;
      var testGege = this.form.commit();
      var divsAttibutes = $('.file-container');
      var allFiles = [];
      if(this.form.validate() == null){
        this.form.commit()
        this.topic.save(null,{
          success: function(data) {
            var fd = new FormData();
            $.each(divsAttibutes, function(){
              var theElement = $(this)[0];
              var theElementField = $(theElement).closest('div .colapsableField')[0];
              if($(theElementField).attr('class').indexOf('hidden') == -1){
                var fieldsetContainer = $(this).closest('div .list-item')[0];
                var inputName = $(fieldsetContainer).find('input[name=TAtt_FieldName]')[0];
                var attributeName = $(inputName).val();
                var elem = this;
                $.each(data.attributes.TAttribute, function(){
                  if(this.TAtt_FieldName == attributeName){
                    allFiles.push({id: this.TAtt_PK_ID, file: $(elem)[0].files[0]});
                    fd.append(this.TAtt_PK_ID, $(elem)[0].files[0]);
                    return;
                  }
                });
              }
            });
            $.ajax({
              type: 'POST',
              url: config.servUrl + 'thesaurus/insertFiles',
              processData: false,
              contentType: false,
              data: fd
            }).done(function() {
              console.log('done');
            }).error(function() {
              console.log('error');
            });
            var tree = $('#' + config.treeDivId).fancytree('getTree');
            var nodeToUpdate = tree.getNodeByKey('' + _this.topic.attributes.TTop_PK_ID );
            nodeToUpdate.setTitle(_this.topic.attributes.TTop_Name);
            Backbone.history.navigate('#consultation/' + _this.topic.attributes.TTop_PK_ID, true);
          }
        });
      }
    },
    retour: function() {

    },
    changeForFile: function(options) {
      var fieldset = $(options.currentTarget).closest('fieldset')[0];
      var fileContainer = $(fieldset).find('.colapsableField')[0];
      var attrValuelabel = $(fieldset).find('label[for=TAtt_FieldValue]')[0];
      var attrValueZone = $(attrValuelabel).parent()[0];
      if ($(fileContainer).attr('class').indexOf('hidden') != -1) {
        if ($(options.currentTarget).val() != 1) {
          $(fileContainer).removeClass('hidden');
          $(attrValueZone).addClass('hidden');
        }
      }else {
        if ($(options.currentTarget).val() == 1) {
          $(fileContainer).addClass('hidden');
          $(attrValueZone).removeClass('hidden');
        }
      }
    },
    testForFile: function(options) {
      var fieldset = $(options.currentTarget).closest('fieldset')[0];
      var idElement = $(fieldset).find('input[name=TAtt_PK_ID]')[0];
      console.log($(idElement).val());
      if ($(idElement).val() != '' && $(idElement).val() !== undefined) {
        $(options.currentTarget).attr('disabled', 'disabled');
        $.growl.warning({ message: I18n.t("topic_field.field_attribute_warning_typeChange")});
      }
    }
  });
});
