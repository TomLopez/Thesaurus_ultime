define(['marionette', 'backbone', 'translater', 'config', 'modTopicFile', 'listOfNestedModel','i18n','transition'],
  function(Marionette, Backbone, Translater, Config, ModTopicFile,ListOfNestedModel,I18n) {

    return Backbone.Model.extend({
      urlRoot: Config.servUrl + 'attribute',
      schema: {
        TAtt_PK_ID:      {type: 'Number', editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_PK_ID"), editorClass: 'form-control'},
        TAtt_FK_TTop_ID:       {type: 'Number', title: $.i18n.t("topicAttribute_field.field_TAtt_FK_TTop_ID"), editorAttrs: {disabled: true},editorClass: 'form-control'},
        TAtt_FieldName:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldName"), editorClass: 'form-control'},
        TAtt_FieldValue:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldValue"), editorClass: 'form-control'},
        TAtt_DateCreation:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_DateCreation"), editorClass: 'form-control'},
        TAtt_Type:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_Type"), editorClass: 'form-control'},
        TTopicFile:   {
          type: 'NestedModel',
          subschema: ModTopicFile,
          fieldClass: 'colapsableField',
          title: $.i18n.t("topicAttribute_field.field_TTopicFile")
        }
      },
      initialize: function(options){
        this.schema = {
          TAtt_PK_ID:      {type: 'Number',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_PK_ID"), editorClass: 'form-control'},
          TAtt_FK_TTop_ID:       {type: 'Number', title: $.i18n.t("topicAttribute_field.field_TAtt_FK_TTop_ID"),editorAttrs: {disabled: true},editorClass: 'form-control'},
          TAtt_FieldName:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldName"), editorClass: 'form-control'},
          TAtt_FieldValue:      {type: 'Text', title: $.i18n.t("topicAttribute_field.field_TAtt_FieldValue"), editorClass: 'form-control'},
          TAtt_DateCreation:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_DateCreation"), editorClass: 'form-control'},
          TAtt_Type:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topicAttribute_field.field_TAtt_Type"), editorClass: 'form-control'},
          TTopicFile:   {
            type: 'NestedModel',
            model: ModTopicFile,
            fieldClass: 'colapsableField',
            title: $.i18n.t("topicAttribute_field.field_TTopicFile")
          }
        }
      }
    });
});
