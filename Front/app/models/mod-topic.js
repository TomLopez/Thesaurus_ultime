define(['marionette', 'backbone', 'translater', 'config', 'modTopicLibelle', 'listOfNestedModel','i18n'],
  function(Marionette, Backbone, Translater, Config, ModTopicLibelle,ListOfNestedModel,I18n) {

    return Backbone.Model.extend({
      urlRoot: Config.servUrl + 'topic',
      schema: {

        TTop_Name:      {type: 'Text', title: $.i18n.t("topic_field.field_name")},
        TTop_Definition:       {type: 'TextArea', title: $.i18n.t("topic_field.field_definitionFr")},
        TTop_FullPath:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_fullpath")},
        TTop_ParentID:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_parentId")},
        TTop_BranchOrder:   {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_branchOrder")},
        TTop_Type:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_type")},
        TTop_Date:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_date")},
        TTopicLibelle:   {
          type: 'ListOfNestedModel',
          subschema: (new ModTopicLibelle()).schema,
          editorAttrs: {disabled: false},
          title: $.i18n.t("topic_field.zone_libelle")
        }
      },
      initialize: function(options){
        this.schema = {
          TTop_Name:      {type: 'Text', title: $.i18n.t("topic_field.field_name")},
          TTop_Definition:       {type: 'TextArea', title: $.i18n.t("topic_field.field_definitionFr")},
          TTop_FullPath:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_fullpath")},
          TTop_ParentID:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_parentId")},
          TTop_BranchOrder:   {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_branchOrder")},
          TTop_Type:      {type: 'Text',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_type")},
          TTop_Date:   {type: 'Date',editorAttrs: {disabled: true}, title: $.i18n.t("topic_field.field_date")},
          TTopicLibelle:   {
            type: 'ListOfNestedModel',
            subschema: (new ModTopicLibelle()).schema,
            editorAttrs: {disabled: false},
            title: $.i18n.t("topic_field.zone_libelle")
          }
        }
      }
    });
});
