define(['marionette', 'backbone', 'config', 'FileUploadEditor', 'i18n'],
function(Marionette, Backbone, Config) {

  return Backbone.Model.extend({
	urlRoot: Config.servUrl + 'topicfile',
	schema: {
	  TTFi_FK_Att_PKID:      {type:'Number',editorAttrs:{disabled:true}, title: $.i18n.t('topicFile_field.field_TTFi_FK_Att_PKID'), editorClass: 'form-control'},
	  TTFi_Blob:       {type:'FileUploadEditor', title: $.i18n.t('topicFile_field.field_TTFi_Blob'), editorClass: 'form-control'},
	  TTFi_Extension:      {type:'Text', title: $.i18n.t('topicFile_field.field_TTFi_Extension'), editorClass: 'form-control'},
	},
	initialize: function(options){
		this.schema = {
			TTFi_FK_Att_PKID:      {type:'Hidden',editorAttrs:{disabled:true},editorAttrs:{disabled:true}, title: $.i18n.t('topicFile_field.field_TTFi_FK_Att_PKID'), editorClass: 'form-control'},
			TTFi_Blob:       {type:'FileUploadEditor', title: $.i18n.t('topicFile_field.field_TTFi_Blob'), editorClass: 'form-control', options:{acceptedFiles:"", uploadurl: Config.servUrl + 'topicfile'}},
			TTFi_Extension:      {type:'Hidden',editorAttrs:{disabled:true}, title: $.i18n.t('topicFile_field.field_TTFi_Extension'), editorClass: 'form-control'},
		}
	}
  });
});
