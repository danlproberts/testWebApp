sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function(Controller, JSONModel, MessageToast, Filter, FilterOperator, FilterType) {
	"use strict";

	return Controller.extend("testwebapptestWebApp.controller.View1", {

		onInit: function() {

			var that = this;
			this.getView().getModel("myService").read("/ToDoListSet", {
				success: function (data) {
					var todoListModel = new JSONModel(data);
					that.getView().setModel(todoListModel, "myItems");
				},
				error: function (oError) {
					MessageToast.show("HELP!");
				}
			});

		},

		onPressAdd: function(input) {

			//Retrieving table data
			var that = this;
			this.getView().getModel("myService").read("/ToDoListSet", {
				success: function (data) {
					var todoListModel = new JSONModel(data);
					that.getView().setModel(todoListModel, "myItems");
				},
				error: function (oError) {
					MessageToast.show("HELP!");
				}
			});

			var oFilter = [new Filter("Listname", FilterOperator.EQ, "nathan")];
			var myList = that.getView().getModel("myItems");

			myList.results.filter(oFilter);

			/*
			//Retrieving input and removing it from input box
			var newItem = this.getView().byId("inputBox").getValue();
			if (newItem === "") {
				newItem = "New Item";
			}
			this.getView().byId("inputBox").setValue("");

			//Retrieving inputted date or generating today's date if blank, then removing it from the field
			var newDate = this.getView().byId("dateBox").getValue();
			if (newDate === "") {
				var today = new Date();

				newDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
			}
			this.getView().byId("dateBox").setValue("");

			//Generating Item Id
			var dataLength = currentData.results.length;

			var i = 0;
			var newId;

			while (i < dataLength) {
				if (currentData.results[i].id !== i) {
					newId = i;
					break;
				}
				i++;
			}

			if (!newId) {
				newId = i;
			}

			//Generating new item for output array
			var newBlob = {
				id: newId,
				title: newItem,
				description: "Edit Description",
				date: newDate
			};

			//Pushing new item into the array - CREATE METHOD
			currentData.results.push(newBlob);
			currentModel.setData(currentData);
			*/

			//Refocusing user input to title box
			this.getView().byId("inputBox").focus();
		},

		onPressEdit: function(oEvent) {

			//Retrieving row on button location
			var eventBC = oEvent.getSource().getBindingContext();
			var line = eventBC.getPath().substr(-1);

			//Retrieving table data
			var oView = this.getView();
			var currentModel = oView.getModel();
			var itemData = currentModel.getData().results[line];

			//var titleBox_Dialog = this.getView().byId("editTitle_input").setValue(itemData.title);

			var oDialog = oView.byId("editDialog");

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "testwebapptestWebApp.fragments.EditView1", this);
				oView.addDependent(oDialog, this);
			}
			
			//Update Method here!
			var fragData = new JSONModel(itemData);
			oDialog.setModel(fragData, "fragModel");
			oDialog.open();

		},
		
		handelPriority: function(dueDate) {
			var today = new Date("M/D/YYYY");
			if (dueDate > today) {
				var diffDays = dueDate.diff(today, "days");
			}
			return diffDays;
		},

		onPressSaveDialog: function() {

			var oView = this.getView();

			var oData = oView.getModel().getData();
			oView.getModel().setData(oData);

			var oDialog = oView.byId("editDialog");
			oDialog.close();

			var msg = "Item Saved";
			MessageToast.show(msg);

		},

		onPressCloseDialog: function() {

			var oView = this.getView();

			var oDialog = oView.byId("editDialog");
			oDialog.close();
		},

		onPressRemove: function(oEvent) {

			//Retrieving row on button location
			var eventBC = oEvent.getSource().getBindingContext();
			var line = eventBC.getPath().substr(-1);

			//Retrieving table data
			var currentModel = this.getView().getModel();
			var currentData = currentModel.getData();

			//Removing row from table data and setting at model - REMOVE method here!
			currentData.results.splice(line, 1);
			currentModel.setData(currentData);

			var msg = "Item Removed";
			MessageToast.show(msg);

		},

		editSaveFocus: function() {
			this.getView().byId("editSave").focus();
		},

		onAfterRendering: function() {

		}
	});
});