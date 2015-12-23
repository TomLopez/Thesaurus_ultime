define(['marionette', 'backbone'],
function(Marionette,Backbone) {
	'use strict';

	return Marionette.LayoutView.extend({
		template: 'app/base/home/tpl/tpl-home.html',
		className: 'home-page ns-full-height',
		events: {
			'click .accButton':'menuItemClick'
		},

		initialize: function() {
			this.model = window.app.user;
		},

		animateIn: function() {
			this.$el.find('#schtroudel').animate(
			{opacity: 1},
			500,
			_.bind(this.trigger, this, 'animateIn')
			);
		},

		// Same as above, except this time we trigger 'animateOut'
		animateOut: function() {
			this.$el.find('#tiles').removeClass('zoomInUp');
			this.$el.animate(
			{opacity: 0},
			500,
			_.bind(this.trigger, this, 'animateOut')
			);
		},

		onShow: function(options) {
			if(this.model.attributes.status.toLowerCase() != 'administrateur'){
				$('#divAccueil').find('.accButton').each(function(){
					if($(this).attr('id') != 'consultation'){
						$(this).remove();
					}
				});
			}
		},
		menuItemClick: function(e){
			console.log(e);
			//return;
			if($(e.currentTarget).attr('id') != 'recherche'){
				app.router.navigate('#' + e.currentTarget.id,{trigger: true});
			}else{
				$('input[name=treeview-search]').focus();
			}
		}
	});
});
