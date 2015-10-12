define(['marionette', 'backbone', 'config'],
function(Marionette, Backbone, Config) {

  return Backbone.Model.extend({
    urlRoot: Config.servUrl + 'language',
    schema: {
      TLan_PK_Name:      'Text',
      TLan_Label:       'Text',
      TLan_Description:      'Text',
    }
  });
});
