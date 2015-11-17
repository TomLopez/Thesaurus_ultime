define(['marionette',
  'backbone',
  'translater',
  'transitionRegion',
  'jquery',
  'jqueryui',
  'i18n',
  'config',
  'requirejs-text!base/tree/tpl/tpl-tree.html'],
  function(Marionette, Backbone, Translater, TransitionRegion, jQuery, ui, I18n, config, Schtroudel) {
    'use strict';
    return Marionette.LayoutView.extend({

      template: Schtroudel,
      className: 'ns-full-height treeContainer',
      apiUrl: 'http://localhost:56121/api/thesaurus',
      language: 'fr',

      initialize: function(options){
        this.options = options;
        this.translater = Translater.getTranslater();
        this.language = options.options.toLowerCase();
      },
      onRender: function(options){
      //this.$el.i18n();
    },
    render: function(options) {
      this.$el = $(Schtroudel);
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
          $span.find("> span.fancytree-title").html(node.title + ' <img src="./Scripts/images/pointeur-souris.png" alt="Terme déprécié, non selectionnable"/>');
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
          console.log('data.hitmode',data.hitmode);
          return
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
              _this.confirmDrop({'thisNode': thisNode, 'otherNode': otherNode, 'hitmode': hitmode});
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
            _this.confirmDrop({'thisNode': thisNode, 'otherNode': otherNode, 'hitmode': hitmode});
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
          type: 'GET',
          url: config.servUrl + "thesaurus/dropEnding?id_movedNode="+otherNode.key+"&id_destNode="+thisNode.key +"&order="+ hitmode,
          //datatype: 'json',
          contentType: "application/json; charset=utf-8",
          //data: '{ "id_movedNode" : "' + otherNode.key + '", "id_destNode": "' + thisNode.key + '", "order": "' + hitmode + '" }',
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
},
});
});
