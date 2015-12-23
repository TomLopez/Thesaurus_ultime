define(['marionette',
  'backbone',
  'translater',
  'transitionRegion',
  'jquery',
  'jqueryui',
  'i18n',
  'config',
  'requirejs-text!base/tree/tpl/tpl-tree.html',
  'sweetAlert',
  'growl'],
  function(Marionette, Backbone, Translater, TransitionRegion, jQuery, ui, I18n, config, Template, swal) {
    'use strict';
    return Marionette.LayoutView.extend({

      template: Template,
      className: 'ns-full-height treeContainer',
      apiUrl: config.servUrl + 'thesaurus',
      language: 'fr',
      events: {
        'change #undeprecateMode': 'deprecatedMode',
        'change #hideMode': 'uselessMode',
        'keyup input[name=treeview-search]': 'research',
        'click #reinit': 'resetResearch'
      },
      dndEvent: {
        0: 'status_ok',
        1: 'status_language_error',
        2: 'status_doublon_error',
        3: 'status_domain_error'
      },

      initialize: function(options){
        this.options = options;
        this.translater = Translater.getTranslater();
        this.language = options.options.toLowerCase();
      },
      onRender: function(options){
      //this.$el.i18n();
    },
    render: function(options) {
      this.$el = $(Template);
      var _this = this;
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
          $span.find("> span.fancytree-title").html(node.title + ' <img src="./app/styles/img/pointeur-souris.png" alt="Terme déprécié, non selectionnable"/>');
        }

      },

      //defini la source pour les elts parents
      source: {
        type: 'GET',
        url: _this.apiUrl + "/fastInitForCompleteTree?StartNodeID=0&lng="+this.language+"&deprecated=true",
        //dataType:'JSONP'
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
         if(window.app.user.get('status').toLowerCase() != 'administrateur'){
          return false;
        }else{
          return true;
        }
      },
      dragDrop: function (node, data) {
         /** This function MUST be defined to enable dropping of items on
          *  the tree.
          */
          var thisNode = node;
          var otherNode = data.otherNode;
          var hitmode = data.hitMode;

         if (data.otherNode.parent.key != node.parent.key) {
          $.ajax({
            type: 'GET',
            url: _this.apiUrl + '/dropDownConstraint?iMovedTopicId=' + otherNode.key + '&iDestTopicId=' + thisNode.key + '&sHitMode='  + hitmode,
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            //data: '{ "iMovedTopicId" : "' + otherNode.key + '", "iDestTopicId": "' + thisNode.key + '", "sHitMode": "' + hitmode + '" }',
          }).success(function (data) {
            if (data == 0) {
              _this.confirmDrop({'thisNode': thisNode, 'otherNode': otherNode, 'hitMode': hitmode});
            } else {
              $.growl.error({ message: I18n.t("dnd_return." + _this.dndEvent[data], {topicName: otherNode.title})});
            }
          });
        } else {
          if (hitmode != "over") {
            thisNode.setExpanded(true).done(function () { otherNode.moveTo(thisNode, hitmode) });
            $.ajax({
              type: 'GET',
              url: _this.apiUrl + '/dropEnding?iMovedTopicId=' + otherNode.key + '&iDestTopicId=' + thisNode.key + '&sHitMode='  + hitmode,
              datatype: 'json',
              contentType: "application/json; charset=utf-8",
              //data: '{ "id_movedNode" : "' + otherNode.key + '", "id_destNode": "' + thisNode.key + '", "order": "' + hitmode + '" }',
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
            _this.confirmDrop({'thisNode': thisNode, 'otherNode': otherNode, 'hitMode': hitmode});
          }
        }
      }
    },
    menu: {
      selector: this.$el.find('ul')[0],
      position: { my: "center" },
      create: function (event, data) {
         //$.ui.fancytree.debug("Menu create ", data.$menu);
       },
       beforeOpen: function (event, data) {
        console.log(window.app)
        if(window.app.user.get('status').toLowerCase() != 'administrateur'){
          return false;
        }else{
          return true;
        }
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
      //Evenement en fin d'expand on applique un filtre si celui ci existe
      expand: function () {
        if ($("#research").val() != undefined && $("#research").val() != "") {
          var nMatch = $("#treeView").fancytree("getTree").applyFilter($("#research").val());
          $("span#matches").text("(" + nMatch + " correspondance(s))");
        }
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
      }
    });
this.setElement(this.$el);
this.$el.i18n();
},
confirmDrop: function(options) {
  var thisNode, otherNode, hitmode;
  thisNode = options.thisNode;
  otherNode = options.otherNode;
  hitmode = options.hitMode;

  swal({
    title: I18n.t("dnd_return.swal_title"),
    text: I18n.t("dnd_return.swal_text"),
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: I18n.t("dnd_return.swal_yesBtn"),
    cancelButtonText: I18n.t("dnd_return.swal_noBtn"),
    closeOnConfirm: true,
    closeOnCancel: true
  },
  function(isConfirm){
    if (isConfirm) {
      $.ajax({
          type: 'GET',
          url: config.servUrl + "thesaurus/dropEnding?id_movedNode="+otherNode.key+"&id_destNode="+thisNode.key +"&order="+ hitmode,
          //datatype: 'json',
          contentType: "application/json; charset=utf-8",
          //data: '{ "id_movedNode" : "' + otherNode.key + '", "id_destNode": "' + thisNode.key + '", "order": "' + hitmode + '" }',
        }).success(function (data) {
          $.growl.notice({ title: $.i18n.t("dnd_return.growl_title_dnd"), message: $.i18n.t("dnd_return.growl_topicDndSuccess", { topicName: data.TTop_Name }) });
          Backbone.history.navigate('#consultation/' + data.TTop_PK_ID, { trigger: true });
        }).error(function () {
          $.growl.error({ message: $.i18n.t("dnd_return.status_unknown_error") });
        });
        thisNode.setExpanded(true).done(function () { otherNode.moveTo(thisNode, hitmode); });
    } else {
        $.growl.warning({ message: $.i18n.t("dnd_return.growl_topicDndCancel") });
    }
  });
},
uselessMode:function(options){
  var tree = this.tree.fancytree('getTree');
  tree.options.filter.mode = $('#hideMode').is(":checked") ? "hide" : "dimm";
  tree.clearFilter();
  $('input[name=treeview-search]').keyup();
  tree.filterNodes($("input[name=treeview-search]").val());
  if (!($('input[name=treeview-search]').val() != "" && $('input[name=treeview-search]').val().length > 3)) {
    tree.clearFilter();
  }
},
research: function(options){
  console.log('research',options)
  var treeHtml = $("#treeView");
  var fancytree = this.tree.fancytree('getTree');
  //Si le nombre d'élément est < a 100 on oblige l'utilisation d'au moins trois caractères pour des raisons de performance
  if (fancytree.count() < 100 || $(options.currentTarget).val().length >= 3) {
    $('#reinit').attr("disabled", false);
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
    var n,
    match = $(options.currentTarget).val();

    n = fancytree.filterNodes(match, false);
    while (treeHtml.find('.fancytree-submatch:not(.fancytree-expanded)').find('.fancytree-expander').length) {
      treeHtml.find('.fancytree-submatch:not(.fancytree-expanded)').find('.fancytree-expander').click();
    }
    if (treeHtml.find('.fancytree-match').length < 3 && treeHtml.find('.fancytree-match').find('.fancytree-match').length)
      treeHtml.find('.fancytree-match').find('.fancytree-expander').click()
    treeHtml.find('ul.fancytree-container li').css("padding", "0px 0 0 0");
  }
  if ($(options.currentTarget).val().length == 0) {
    fancytree.clearFilter();
    treeHtml.fancytree("getRootNode").visit(function (node) {
      node.setExpanded(false);
    });
    return;
  }
},
resetResearch: function(options){
  var tree = this.tree.fancytree('getTree');
  var rootNode = this.tree.fancytree("getRootNode");
  tree.clearFilter();
  $('input[name=treeview-search]').val("");
  rootNode.visit(function (node) {
    node.setExpanded(false);
  });
  return;
}
});
});
