/**

	TODO:
	- header class hide : see router.js & app.js

**/

define(['marionette', 'config'],
function(Marionette, config) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/header/tpl-header.html',
    className: 'header',
    events: {
      'click #logout': 'logout',
    },

    initialize: function() {
      this.model = window.app.user;
    },


    logout: function() {





    },

    onShow: function() {
      $('#lblUser').text(this.model.attributes.user)
    },
  });
});
