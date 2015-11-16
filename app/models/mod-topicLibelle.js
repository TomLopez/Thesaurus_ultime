define(['marionette', 'backbone', 'config','i18n'],
function(Marionette, Backbone, Config, I18n) {

  return Backbone.Model.extend({
    urlRoot: Config.servUrl + 'topicLibelle',
    schema: {
      TLib_Name:      {type:'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_name')},
      TLib_FullPath:      {type:'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_fullPath')},
      TLib_Definition:       {type:'TextArea', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_Definition')},
      TLib_FK_TLan_ID:      {type: 'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKLangue')},
      TLib_FK_TTop_ID:      {type: 'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKTopic')},
      TLib_PK_ID:   {type: 'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_PKLibelle')},
    },
    initialize: function(options){
      this.schema = {
        TLib_Name:      {type:'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_name')},
        TLib_FullPath:      {type:'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_fullPath')},
        TLib_Definition:       {type:'TextArea', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_Definition')},
        TLib_FK_TLan_ID:      {type: 'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKLangue')},
        TLib_FK_TTop_ID:      {type: 'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKTopic')},
        TLib_PK_ID:   {type: 'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_PKLibelle')},
      }
    }
  });
});
