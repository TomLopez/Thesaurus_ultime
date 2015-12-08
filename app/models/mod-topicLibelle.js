define(['marionette', 'backbone', 'config','i18n'],
function(Marionette, Backbone, Config, I18n) {

  return Backbone.Model.extend({
    urlRoot: Config.servUrl + 'topicLibelle',
    schema: {
      TLib_FK_TLan_ID:      {type: 'Select', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKLangue'), editorClass: 'form-control',options:[{label: 'Français', val: 'fr', icon: null},{label: 'English', val: 'en', icon: null}]},
      TLib_Name:      {type:'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_name'), editorClass: 'form-control'},
      TLib_FullPath:      {type:'Text', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_fullPath'), editorClass: 'form-control'},
      TLib_Definition:       {type:'TextArea', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_Definition'), editorClass: 'form-control'},
      TLib_FK_TTop_ID:      {type: 'Hidden', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKTopic'), editorClass: 'form-control'},
      TLib_PK_ID:   {type: 'Hidden', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_PKLibelle'), editorClass: 'form-control'},
    },
    initialize: function(options){
      var languages = [];
      $.ajax({
        type: 'GET',
        url: Config.servUrl + 'language',
        async:false
      }).done(function(data){
        $.each(data,function(){
          languages.push({label: this.TLan_Label, val: this.TLan_PK_Name, icon: null})
        });
      }).error(function(err){
        alert("Une erreur est survenue durant le chargement des langues");
        console.log('Error : ', err);
      });
        this.schema = {
          TLib_FK_TLan_ID:      {type: 'Select', title: $.i18n.t('topicLibelle_field.lib_FKLangue'), editorClass: 'form-control',options:languages},
          TLib_Name:      {type:'Text', title: $.i18n.t('topicLibelle_field.lib_name'), editorClass: 'form-control'},
          TLib_FullPath:      {type:'Text', title: $.i18n.t('topicLibelle_field.lib_fullPath'), editorClass: 'form-control'},
          TLib_Definition:       {type:'TextArea', title: $.i18n.t('topicLibelle_field.lib_Definition'), editorClass: 'form-control'},
          TLib_FK_TTop_ID:      {type: 'Hidden', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_FKTopic'), editorClass: 'form-control'},
          TLib_PK_ID:   {type: 'Hidden', editorAttrs: {disabled: true}, title: $.i18n.t('topicLibelle_field.lib_PKLibelle'), editorClass: 'form-control'},
        /*}*/
      };
    }
  });
});
