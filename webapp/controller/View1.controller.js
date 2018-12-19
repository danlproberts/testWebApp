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
			this.getOwnerComponent().getModel("dataStore");
			
			var today = new Date();

			var initFields = {Title: "", Duedate: null};
			var initAdds = new JSONModel(initFields);
			this.getView().setModel(initAdds, "addFields");
		},

		onPressMyFilter: function(oEvent) {

			var state = oEvent.getParameter("state");
			var dataStore = this.getOwnerComponent().getModel("dataStore").getData();

			var oData = this.getView().byId("table").getBinding("items");
			var aFilter = [new Filter("Deleted", FilterOperator.EQ, "false")];
			
			if (state) {
				aFilter.push(new Filter("Listname", FilterOperator.Contains, dataStore.Listname));
				
			} else {
				aFilter.push(new Filter("Listname", FilterOperator.Contains, ""));
			}

			oData.filter(aFilter, FilterType.Application);
		},

		onPressAdd: function(oEvent) {

			var today = new Date();
			var oData = this.getOwnerComponent().getModel();
			var dataStore = this.getOwnerComponent().getModel("dataStore").getData();

			//Retrieving input and removing it from input box
			var newItem = this.getView().getModel("addFields").getProperty("/Title");
			if (newItem === "") {
				newItem = "New Item";
			}

			//Retrieving inputted date or generating today's date if blank, then removing it from the field
			var newDate = this.getView().getModel("addFields").getProperty("/Duedate");
			if (newDate === null) {
				newDate = new Date();
			}
			/*
			//Generating Item Id
			var oUnfiltered = oData.filter([], FilterType.Application);

			var dataLength = oData.getLength();

			var i = 0;
			var newId;

			while (i < dataLength) {
				if (oData[i].id !== i) {
					newId = i;
					break;
				}
				i++;
			}

			if (!newId) {
				newId = i;
			}
			*/
			//Generating new item for output array
			var newBlob = {
				Title: newItem,
				Description: "Edit Description",
				Duedate: newDate,
				Assignedto: "",
				Listname: dataStore.Listname,
				Createdby: "",
				Completeddate: ""
			};

			//Pushing new item into the array - CREATE METHOD
			var that = this;
			this.getView().getModel().create("/ToDoListSet", newBlob, {
				success: function () {
					that.getView().getModel("addFields").setData({Title: "", Duedate: today});
				}, 
				error: function (oError) {
					console.log(oError);
				}
			})
			
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
			
			var oData = this.getView().byId("table").getBinding("items");
			var aFilter = [new Filter("Deleted", FilterOperator.EQ, "false")];
			oData.filter(aFilter, FilterType.Application);
					
		}
	});
});