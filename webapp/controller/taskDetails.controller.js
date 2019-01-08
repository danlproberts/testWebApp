sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "testwebapptestWebApp/controller/View1.controller",
    "sap/ui/model/Filter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
	"testwebapptestWebApp/util/usefulFunctions"
], function(UIComponent, Controller, View1, Filter, History, JSONModel, usefulFunctions) {
    "use strict";

    return Controller.extend("testwebapptestWebApp.controller.taskDetails", {

        onInit: function() {
            UIComponent.getRouterFor(this).getRoute("taskDetails").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent){
            let taskId = oEvent.getParameter("arguments").itemId;
            console.log(taskId);

            this.fetchItem(taskId);
        },

        onNavBack: function() {
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("main", {}, true);
			}
        },

        fetchItem: function(itemId){

            var filter = [new Filter("Id", "EQ", itemId)]

            this.getView().getModel().read(usefulFunctions.returnPath(), {
				filters : filter,
				success: function(data){
					console.log(data.results[0]);
					var myModel = new JSONModel(data.results[0]);
					this.getView().setModel(myModel, "itemModel");
					
				}.bind(this),
				error: function(oError) {
					console.log(oError);
				}
			})

        },

        onAfterRendering: function(){

        }
    });
});