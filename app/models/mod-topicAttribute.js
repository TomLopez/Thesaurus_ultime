define(['marionette', 'backbone', 'translater', 'config', 'modTopicFile', 'listOfNestedModel','i18n','requirejs-text!base/modification/tpl/tpl-formModifAttribute.html','transition'],
  function(Marionette, Backbone, Translater, Config, ModTopicFile,ListOfNestedModel,I18n, Template) {

    return Backbone.Model.extend({
      urlRoot: Config.servUrl + 'attribute',
      template: Template,
      schema: {
        TAtt_PK_ID:      {type: 'Number', editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_PK_ID"), editorClass: 'form-control'},
        TAtt_FK_TTop_ID:       {type: 'Number', title: $.i18n.t("topicAttribute_field.field_TAtt_FK_TTop_ID"), editorAttrs: {disabled: true},editorClass: 'form-control'},
        TAtt_FieldName:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldName"), editorClass: 'form-control'},
        TAtt_FieldValue:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldValue"), editorClass: 'form-control'},
        TAtt_DateCreation:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_DateCreation"), editorClass: 'form-control'},
        TAtt_Type:      {type: 'Select',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_Type"), editorClass: 'form-control', options: [{label: 'Fichier', val: '3', icon: null},{label: 'Image', val: '2', icon: null},{label: 'Description', val: '1', icon: null}]},
        TTopicFile:   {
          type: 'NestedModel',
          subschema: ModTopicFile,
          fieldClass: 'colapsableField',
          title: $.i18n.t("topicAttribute_field.field_TTopicFile")
        }
      },
      initialize: function(options){
        console.log('this.template',this.template);
        this.template = Template;
        this.schema = {
          TAtt_PK_ID:      {type: 'Hidden',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_PK_ID"), editorClass: 'form-control'},
          TAtt_FK_TTop_ID:       {type: 'Hidden', title: $.i18n.t("topicAttribute_field.field_TAtt_FK_TTop_ID"),editorAttrs: {disabled: true},editorClass: 'form-control'},
          TAtt_FieldName:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldName"), editorClass: 'form-control', validators:['required']},
          TAtt_Type:      {type: 'Select',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_Type"), editorClass: 'form-control', options:[{label: 'Description', val: '1', icon: null},{label: 'Fichier', val: '3', icon: null},{label: 'Image', val: '2', icon: null}]},
          TAtt_FieldValue:      {type: 'TextArea', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldValue"), editorClass: 'form-control'},
          TAtt_DateCreation:   {type: 'Hidden',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_DateCreation"), editorClass: 'form-control'},
          TTopicFile:   {
            type: 'NestedModel',
            model: ModTopicFile,
            fieldClass: 'colapsableField hidden',
            title: $.i18n.t("topicAttribute_field.field_TTopicFile"),
            editorClass: 'form-control'
          }
        }
      },
    });
});
