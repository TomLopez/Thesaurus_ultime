var TreeViewView = Backbone.View.extend({
	tagName: 'div',
	className: 'treeContainer',
	apiUrl: 'http://localhost:56121/api/thesaurus',
	language: 'fr',
	initialize: function (data) {
		this.template = _.template(this.constructor.templateSrc);
	},
	render: function () {
		_this = this;
		this.$el.html(this.template());
		//var isSelectedCheckBox = false;
		this.tree = this.$el.find('#treeView').fancytree({
			debugLevel: 0,
			//Utilisation des checkboxes
			checkbox: false,
			selectMode: 1,
			icons: false,
			//utilisation du module filter
			extensions: ["filter", "menu", "dnd"],
			boolean: {
				isExpand: false,
				isSelectedCheckBox: false
			},
			filter: {
				mode: 'hide'
			},
			//Action qui sera effectué a l'affichage de l'arbre
			renderNode: function (event, data) {
				var node = data.node;
				if (node.data.deprecated) {
					var $span = $(node.span);
					$span.find("> span.fancytree-title").html(node.title + ' <img src="./Scripts/images/pointeur-souris.png" alt="Terme déprécié, non selectionnable"/>');
				}

			 },

			//defini la source pour les elts parents
			source: {
				type: "GET",
				//url: _this.apiUrl + "/" + tabStrWebservice['init'],
				url: _this.apiUrl + "/fastInitForCompleteTree?StartNodeID=0&lng=fr",
				datatype: 'json',
//				contentType: "application/json; charset=utf-8",
				//data: //'{ "StartNodeID":0,"lng" : "' + _this.language + '" }',
				//data: JSON.stringify({ StartNodeID: 0,lng: _this.language}),
			},
			dnd: {
				autoExpandMS: 1000,
				focusOnClick: true,
				preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
				preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
				dragStart: function (node, data) {
				 /** This function MUST be defined to enable dragging for the tree.
					*  Return false to cancel dragging of node.
					*/
					return true;
				},
				dragEnter: function (node, data) {
				 /** data.otherNode may be null for non-fancytree droppables.
					*  Return false to disallow dropping on node. In this case
					*  dragOver and dragLeave are not called.
					*  Return 'over', 'before, or 'after' to force a hitMode.
					*  Return ['before', 'after'] to restrict available hitModes.
					*  Any other return value will calc the hitMode from the cursor position.
					*/
				 // Prevent dropping a parent below another parent (only sort
				 // nodes under the same parent)
				 //if (node.parent !== data.otherNode.parent) {
				 //    return false;
				 //}
				 //node.setExpanded(true);
				 //return ["before", "after"];
				 return true;
				},
				dragDrop: function (node, data) {
				 /** This function MUST be defined to enable dropping of items on
					*  the tree.
					*/
					var thisNode = node;
					var otherNode = data.otherNode;
					var hitmode = data.hitMode;
				 //console.log(data.otherNode);
				 //console.log(node);

				 if (data.otherNode.parent.key != node.parent.key) {
					$.ajax({
						type: 'POST',
						url: _this.apiUrl + "/dropDownConstraint",
						datatype: 'json',
						contentType: "application/json; charset=utf-8",
						data: '{ "iMovedTopicId" : "' + otherNode.key + '", "iDestTopicId": "' + thisNode.key + '", "sHitMode": "' + data.hitMode + '" }',
					}).success(function (data) {
						if (data) {
							confirmDrop(thisNode, otherNode, hitmode);
						} else {
							$.growl.error({ message: "Le terme ne peut être déplacer ici pour des raisons de doublons TTop_Name : " + otherNode.title });
						}
					});
				 } else {
					if (hitmode != "over") {
						thisNode.setExpanded(true).done(function () { otherNode.moveTo(thisNode, hitmode) });
						$.ajax({
							type: 'POST',
							url: apiUrl + "/dropEnding",
							datatype: 'json',
							contentType: "application/json; charset=utf-8",
							data: '{ "id_movedNode" : "' + otherNode.key + '", "id_destNode": "' + thisNode.key + '", "order": "' + hitmode + '" }',
						}).success(function (data) {
							$.growl.notice({ title: "Déplacement", message: "déplacement du terme " + data.TTop_Name + " réussi." });
							if (Backbone.history.fragment.indexOf("modif") == -1 && Backbone.history.fragment.indexOf("suppr") == -1) {
								isTopicMenu = true;
								adaptMenu(otherNode.key);
								$("#unitaireInfo").val(otherNode.key);
								Backbone.history.fragment = null;
								router.navigate('consultation/' + data.TTop_PK_ID, { trigger: true });
							}else{
								Backbone.history.fragment = null;
								router.navigate('consultation/' + data.TTop_PK_ID, { trigger: true });
							}
						}).error(function () {
							$.growl.error({ message: "Une erreur est survenu durant le déplacement. Veuillez réessayer plus tard." });
						});
					} else {
						confirmDrop(thisNode, otherNode, hitmode);
					}
				 }
				}
			},
			loadChildren:function(){
				/*if(Backbone.history.getFragment().indexOf("consultation") != -1){
					console.log(arguments);
					var node = $(this).fancytree("getTree").getNodeByKey("" + Backbone.history.getFragment().split("/")[1]);
				 //node.makeVisible({scrollIntoView: true});
				 fncConsultation();
				}*/
			},
			menu: {
				selector: this.$el.find('ul')[0],
				position: { my: "center" },
				create: function (event, data) {
				 //$.ui.fancytree.debug("Menu create ", data.$menu);
				},
				beforeOpen: function (event, data) {
				 //$.ui.fancytree.debug("Menu beforeOpen ", data.$menu, data.node);
				},
				open: function (event, data) {
					$("#unitaireInfo").val(data.node.key);
					data.$menu.find('.Consulter a').attr('href', '#consultation/' + data.node.key);
					data.$menu.find('.Créer a').attr('href', '#creation/' + data.node.key);
					data.$menu.find('.Modifier a').attr('href', '#modification/' + data.node.key);
					data.$menu.find('.Supprimer a').attr('href', '#suppression/' + data.node.key);
				},
				focus: function (event, data) {

				},
				select: function (event, data) {
				},
				close: function (event, data) {
				 //$.ui.fancytree.debug("Menu close ", data.$menu, data.node);
				}
			},
			 //Close pour option de  filter
			 focus: function (event, node) {
				/*if (!$(this).fancytree("getTree").options.boolean.isSelectedCheckBox && Backbone.history.fragment.indexOf("modif") == -1 && Backbone.history.fragment.indexOf("creerEnf") == -1 && !$(this).fancytree("getTree").options.boolean.isExpand) {
					isTopicMenu = true;
					adaptMenu(node.node.key);
					router.navigate('consultation/' + node.node.key, { trigger: true });
				}*/
			},
			//Evenement en fin d'expand on applique un filtre si celui ci existe
			expand: function () {
				if ($("#research").val() != undefined && $("#research").val() != "") {
					var nMatch = $("#treeView").fancytree("getTree").applyFilter($("#research").val());
					$("span#matches").text("(" + nMatch + " correspondance(s))");
				}
			},
			//evenement d'activation de l'arbre
			activate: function (event, data) {
					//        alert("activate " + data.node);
			},
			click:function(event,data){
				console.log(data);
				if(data.targetType == "title"){
					app.router.navigate('#consultation/' + data.node.key,{trigger: true});
				}
			},
			select: function (event, data) {
				$(this).fancytree("getTree").options.boolean.isSelectedCheckBox = true;
			//if (data.node.key != $("#unitaireInfo").val()) {
				if (Backbone.history.fragment.indexOf("modif") != -1 && !bForSelect) {
					var selectedNode = $("#treeView").fancytree("getTree").getSelectedNodes();
					if (selectedNode != "") {
						router.navigate('modificationUnitaire/' + data.node.key, { trigger: true });
					}
					else {
						$("#ItemThesaurusEdit").attr("style", "display:none;");
					}
				}
				else if (Backbone.history.fragment.indexOf("creationEnfant") != -1 && !bForSelect) {
					if (selectedNode != "") {
						router.navigate('creationEnfant/' + data.node.key, { trigger: true });
					} else {
						$("#ItemThesaurusEdit").attr("style", "display:none;");
					}
				}
				else if (Backbone.history.fragment.indexOf("suppr") != -1) {
					router.navigate('suppressionUnitaire/' + data.node.key, { trigger: true });
				}
			//}
			}
		});

var checkboxHideMode = this.$el.find('#hideMode');
var checkboxUndeprecateMode = this.$el.find('#undeprecateMode');
var buttonReset = this.$el.find('button');
var inputResearch = this.$el.find("input[name=treeview-search]");
var tree = $("#treeView").fancytree("getTree");
var hideLabel = $('#hideLabel');
var reschValueOld = "";

hideLabel.click(function () {
	if (checkboxHideMode.is(':checked')) {
		checkboxHideMode.attr('checked', false);
		checkboxHideMode.change();
	} else {
		checkboxHideMode.attr('checked', true);
		checkboxHideMode.change();
	}
});

checkboxHideMode.change(function (e) {
	tree.options.filter.mode = $(this).is(":checked") ? "hide" : "dimm";
	tree.clearFilter();
	inputResearch.keyup();
	$("#treeView").fancytree("getTree").applyFilter($("input[name=treeview-search]").val());
	if (!(inputResearch.val() != "" && inputResearch.val().length > 3)) {
		tree.clearFilter();
	}
				 //}
				});
checkboxUndeprecateMode.change(function () {
	if ($(this).is(":checked")) {
		tabStrWebservice['init'] = 'initTreeLazyWLanguageWithoutDeprecated';
		tabStrWebservice['lazyLoad'] = 'getTreeChildWLanguageWithoutDeprecated';
		tabStrWebservice['research'] = 'researchTopicWLanguageWithoutDeprecated';
	} else {
		tabStrWebservice['init'] = 'initTreeLazyWLanguage';
		tabStrWebservice['lazyLoad'] = 'getTreeChildWLanguage';
		tabStrWebservice['research'] = 'researchTopicWLanguage';
	}
				 //console.log(tabStrWebservice);
				 $("#treeView").fancytree("getTree").reload();
				});
buttonReset.click(function (e) {
	resetResearch();
}).attr("disabled", true);

var rschTimeout;

inputResearch.keyup(function (e) {
	var treeHtml = $("#treeView");
	var fancytree = treeHtml.fancytree("getTree");
					//Si le nombre d'élément est < a 100 on oblige l'utilisation d'au moins trois caractères pour des raisons de performance
					if (fancytree.count() < 100 || $(this).val().length >= 3) {
						buttonReset.attr("disabled", false);
						treeHtml.find('ul.fancytree-container li').css("padding", "1px 0 0 0");
						treeHtml.fancytree("getRootNode").visit(function (node) {
							if (node.span) {
								var className = node.span.className;
								if (className.indexOf('fancytree-hide') != -1) {
									node.setExpanded(false);
								}
							} else {
								node.setExpanded(false);
							}
						});
						match = $(this).val();
						var n,
						match = $(this).val();

						if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
							resetResearch();
						}
						n = fancytree.filterNodes(match, false);
						while (treeHtml.find('.fancytree-submatch:not(.fancytree-expanded)').find('.fancytree-expander').length) {
							treeHtml.find('.fancytree-submatch:not(.fancytree-expanded)').find('.fancytree-expander').click();
						}
						if (treeHtml.find('.fancytree-match').length < 3 && treeHtml.find('.fancytree-match').find('.fancytree-match').length)
							treeHtml.find('.fancytree-match').find('.fancytree-expander').click()
						treeHtml.find('ul.fancytree-container li').css("padding", "0px 0 0 0");
					}
					if ($(this).val().length == 0) {
						fancytree.clearFilter();
						treeHtml.fancytree("getRootNode").visit(function (node) {
							node.setExpanded(false);
						});
						return;
					}
				}).focus()
return this;
}
}, {//Template des différents élément de l'arbre et de ses copains (menu, hidden, checkbox de dissimulation des elts inutiles,...)
templateSrc: '<input type="text" class="treeItemTranslates" name="treeview-search" placeholder="" data-i18n="[placeholder]tree.search_placeholder" autocomplete="off">' +
'<button id="reinit" class="treeItemTranslates" style=" margin-top: -11;margin-left: 22;" data-i18n="tree.search_button"></button>' +
'<input type="hidden" id="research" value="" />' +
'<input type="hidden" id="action" value="" />' +
'<input type="hidden" id="unitaireInfo" value="" />' +
'<span id="treeview-matches"></span>' +
'<div style="display:block;"><input id="hideMode" style="margin-top:-1;" type="checkbox" checked><label id="hideLabel" style="display:inline;" class="treeItemTranslates" data-i18n="tree.checkbox_useless_node"></label></div>' +
'<div style="display:block;"><input id="undeprecateMode" style="margin-top:-1; display:inline;" type="checkbox"><label id="undeprecateLabel" class="treeItemTranslates" style="display:inline;" data-i18n="tree.checkbox_deprecated_node"></label></div>' +
'<label id="treeview-selectedValue"></label>' +
'<div id="treeView" style="height: 95%"></div>' +
'<ul class="contextMenu ui-helper-hidden">' +
								'<li class="Créer"><a href="#creation" onclick="$(\'.contextmenu\').attr(\'style\', \'display:none\'); document.location=this.href;"><img src="Scripts/NavBar/images/Mark-To-Download-48.png" /></br><span class="treeItemTranslates" data-i18n="contextualMenu_Label.creerEnf">Créer Enfants</span></a></li>' +  //OK
								'<li class="Consulter"><a href="#consultation" onclick="$(\'.contextmenu\').attr(\'style\', \'display:none\'); document.location=this.href;"><img src="Scripts/NavBar/images/Command-Paste-48.png" /></br><span class="treeItemTranslates" data-i18n="contextualMenu_Label.consulter">Consulter</span></a></li>' +  //OK
							'<li class="Modifier"><a href="#modification" onclick="$(\'.contextmenu\').attr(\'style\', \'display:none\'); document.location=this.href;"><img src="Scripts/NavBar/images/Editor-48.png" /></br><span class="treeItemTranslates" data-i18n="contextualMenu_Label.modifier">Modifier</span></a></li>' +  //OK
							'<li>---</li>' +
							'<li class="Supprimer"><a href="#suppression" onclick="$(\'.contextmenu\').attr(\'style\', \'display:none\'); document.location.href=this.href"><img src="Scripts/NavBar/images/Garbage-48.png" /></br><span class="treeItemTranslates" data-i18n="contextualMenu_Label.supprimer">Supprimer</span></a></li>' +
							'</ul>'
						});

//Fonction qui va expand les branches contenant les elts rechercher
function expandAllSelected(listTopic, i) {
	 //Le padding sert a créer de l'espace quand on fait une rechercher pour les termes ne se chevauchent pas
	 $('ul.fancytree-container li').css("padding", "2px 0 0 0");
	 var tree = $("#treeView").fancytree("getTree");
	 tree.options.boolean.isExpand = true;
	 var activeNode;
	 //Si l'elts suivant est différents de -1 (l'elt avant -1 est l'elt rechercher par l'utilisateur
		if (listTopic[i + 1] != -1) {
			tree.activateKey("" + listTopic[i])
			if (tree.getActiveNode() != null) {
				 //On active le noeud puis on le récupère
				 tree.activateKey("" + listTopic[i] + "");
				 activeNode = tree.getActiveNode();
				 //On expand le noeud actif
				 return activeNode.setExpanded(true).then(function () {
						//une fois le noeud étendu et les donnée de celui chargée on rappel la fonction
						//afin de descendre plus bas dans la branche
						return expandAllSelected(listTopic, i + 1);
					});
				}
			//si listTopic[i + 1] == -1 l'elt listTopic[i + 2] est la racine de la prochaine branche
			//Qui contient un elt rechercher
		} else if (listTopic[i + 1] == -1 && listTopic[i + 2] !== undefined) {
			return expandAllSelected(listTopic, i + 2);
		} else {
			if (Backbone.history.fragment.indexOf("creerEnf") != -1) {
				var nodeForChild = tree.getActiveNode();
				nodeForChild.setSelected();
				$('ul.fancytree-container li').css("padding", "0px 0 0 0");
				tree.options.boolean.isExpand = false;
			} else if (Backbone.history.fragment.indexOf("modif") != -1) {
				tree.getNodeByKey(tree.lastSelectedNode.key).setSelected(true);
				$('ul.fancytree-container li').css("padding", "0px 0 0 0");
				tree.options.boolean.isExpand = false;
			} else {
				 //On met le padding a zero une fois la recherche effectuée afin de resseré les termes utile
				 $('ul.fancytree-container li').css("padding", "0px 0 0 0");
				 tree.options.boolean.isExpand = false;
				}
				return $.Deferred().resolve().promise();
			}
		}

		function confirmDrop(thisNode, otherNode, hitmode) {
			var info;
			if (hitmode == 'over') {
				info = $.i18n.t("growlMessage.growl_topicDndSon", { node1: otherNode.title, node2: thisNode.title });
			} else {
				info = $.i18n.t("growlMessage.growl_topicDndBrother", { node1: otherNode.title, node2: thisNode.title });
			}
			$('<div></div>').appendTo('body')
			.html('<div><h6>' + info + '</h6></div>')
			.dialog({
				modal: true,
				title: $.i18n.t('dragNDrop_messages.confirm'),
				zIndex: 10000,
				autoOpen: true,
				width: '300px',
				resizable: false,
				buttons: {
					Yes: function () {
						$.ajax({
							type: 'POST',
							url: apiUrl + "/dropEnding",
							datatype: 'json',
							contentType: "application/json; charset=utf-8",
							data: '{ "id_movedNode" : "' + otherNode.key + '", "id_destNode": "' + thisNode.key + '", "order": "' + hitmode + '" }',
						}).success(function (data) {
							$.growl.notice({ title: $.i18n.t("growlMessage.growl_title_dnd"), message: $.i18n.t("growlMessage.growl_topicDndSuccess", { topicName: data.TTop_Name }) });
							if (Backbone.history.fragment.indexOf("modif") == -1 && Backbone.history.fragment.indexOf("suppr") == -1) {
								isTopicMenu = true;
								adaptMenu(otherNode.key);
								$("#unitaireInfo").val(otherNode.key);
								router.navigate('consultation/' + data.TTop_PK_ID, { trigger: true });
							}
						}).error(function () {
							$.growl.error({ message: $.i18n.t("growlMessage.growl_topicDndErrorUnknown") });
						});
						thisNode.setExpanded(true).done(function () { otherNode.moveTo(thisNode, hitmode); });

						$(this).dialog("close");
					},
					No: function () {
						$.growl.warning({ message: $.i18n.t("growlMessage.growl_topicDndCancel") });
						$(this).dialog("close");
					}
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
}

function resetResearch(){
	var tree = $("#treeView").fancytree("getTree");
	var rootNode = $("#treeView").fancytree("getRootNode");
	tree.clearFilter();
	$('input[name=treeview-search]').val("");
	rootNode.visit(function (node) {
		node.setExpanded(false);
	});
	return;
}
