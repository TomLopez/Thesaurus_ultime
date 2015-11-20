define(['marionette', 'backbone', 'translater', 'config', 'modTopicLibelle', 'modAttribute', 'modTopicFile', 'listOfNestedModel','i18n','transition'],
  function(Marionette, Backbone, Translater, Config, ModTopicLibelle, ModAttribute, ModTopicFile, ListOfNestedModel,I18n) {

    return Backbone.Model.extend({
      urlRoot: Config.servUrl + 'topic',
      schema: {

        TTop_Name:      {type: 'Text', title: $.i18n.t("topic_field.field_name"), editorClass: 'form-control'},
        TTop_Definition:       {type: 'TextArea', title: $.i18n.t("topic_field.field_definitionFr"), editorClass: 'form-control'},
        TTop_FullPath:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_fullpath"), editorClass: 'form-control'},
        TTop_ParentID:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_parentId"), editorClass: 'form-control'},
        TTop_BranchOrder:   {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_branchOrder"), editorClass: 'form-control'},
        TTop_Type:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_type"), editorClass: 'form-control'},
        TTop_Date:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_date"), editorClass: 'form-control'},
        TTopicLibelle:   {
          type: 'ListOfNestedModel',
          subschema: (new ModTopicLibelle()).schema,
          fieldClass: 'colapsableField',
          title: $.i18n.t("topic_field.zone_libelle")
        },
/*          TAttibute:{
            type: 'ListOfNestedModel',
            subschema: (new ModAttribute()).schema,
            fieldClass: 'colapsableField',
            title: $.i18n.t("topic_field.zone_libelle")
          }*/
      },
      initialize: function(options){
        this.schema = {
          TTop_Name:      {type: 'Text', title: $.i18n.t("topic_field.field_name"), editorClass: 'form-control'},
          TTop_Definition:       {type: 'TextArea', title: $.i18n.t("topic_field.field_definitionFr"), editorClass: 'form-control'},
          TTop_FullPath:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_fullpath"), editorClass: 'form-control'},
          TTop_ParentID:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_parentId"), editorClass: 'form-control'},
          TTop_BranchOrder:   {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_branchOrder"), editorClass: 'form-control'},
          TTop_Type:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_type"), editorClass: 'form-control'},
          TTop_Date:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_date"), editorClass: 'form-control'},
          TTopicLibelle:   {
            type: 'ListOfNestedModel',
            subschema: (new ModTopicLibelle()).schema,
            fieldClass: 'colapsableField',
            title: $.i18n.t("topic_field.zone_libelle")
          },
          /*TAttibute:{
            type: 'ListOfNestedModel',
            subschema: (new ModAttribute()).schema,
            fieldClass: 'colapsableField',
            title: $.i18n.t("topic_field.zone_attribute")
          }*/
        }
      }
    });
});
