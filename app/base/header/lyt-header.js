/**

	TODO:
	- header class hide : see router.js & app.js

**/

define(['marionette', 'backbone','config', 'i18n', 'tooltipster-list'],
function(Marionette, Backbone, config, I18n) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/header/tpl-header.html',
    className: 'header',
    events: {
      'click #logout': 'logout',
      'click #management': 'management'
    },

    initialize: function() {
      this.model = window.app.user;
    },


    logout: function() {

    },

    onShow: function() {
      $('#lblUser').text(this.model.attributes.user)
    },
    management: function(options){
      var CommonEvent = [{
                label : I18n.t("header_menu.language"),
                val : "#language"
            }];

      $(options.currentTarget).tooltipList({
                tooltipClass: 'withoutInput tooltipList',
                position: 'bottom',
                //  pass avalaible options
                availableOptions: CommonEvent,
                //  li click event
                liClickEvent: $.proxy(function (liClickValue, origin, tooltip) {
                    Backbone.history.navigate(liClickValue, true);
                }, this),
            });
            $(options.currentTarget).tooltipster('show');
    },
    liClickValue: function(){
      alert("cliquette");
    }
  });
});
