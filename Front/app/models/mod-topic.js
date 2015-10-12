define(['marionette', 'backbone', 'config'],
function(Marionette, Backbone, Config) {

  return Backbone.Model.extend({
    urlRoot: Config.servUrl + 'topic',
    schema: {
      TTop_Name:      'Text',
      TTop_Definition:       'TextArea',
      TTop_FullPath:      {type: 'Text',editorAttrs: {disabled: true}},
      TTop_ParentID:      {type: 'Text',editorAttrs: {disabled: true}},
      TTop_BranchOrder:   {type: 'Text',editorAttrs: {disabled: true}},
      TTop_Type:      {type: 'Text',editorAttrs: {disabled: true}},
      TTop_Date:   {type: 'Date',editorAttrs: {disabled: true}},
    }
  });
});
