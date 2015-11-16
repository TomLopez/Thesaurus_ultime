define(['marionette', 'backbone', 'config', 'i18n'],
function(Marionette, Backbone, Config) {

  return Backbone.Model.extend({
	urlRoot: Config.servUrl + 'language',
	schema: {
	  TLan_PK_Name:      {type:'Text', title: $.i18n.t('language_edit.field_TLan_PK_Name')},
	  TLan_Label:       {type:'Text', title: $.i18n.t('language_edit.field_label')},
	  TLan_Description:      {type:'Text', title: $.i18n.t('language_edit.field_description')},
	},
	initialize: function(options){
		this.schema = {
			TLan_PK_Name:      {type:'Text', title: $.i18n.t('language_edit.field_TLan_PK_Name')},
			TLan_Label:       {type:'Text', title: $.i18n.t('language_edit.field_label')},
			TLan_Description:      {type:'Text', title: $.i18n.t('language_edit.field_description')},
		}
	}
  });
});
