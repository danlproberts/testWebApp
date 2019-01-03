sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, MessageToast, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("testwebapptestWebApp.controller.View1", {

		onInit: function() {

			//Set Model for input fields
			var initFields = {Title: "", Duedate: null};
			var initAdds = new JSONModel(initFields);
			this.getView().setModel(initAdds, "addFields");

			//Set switch state model
			var myStateModel = new JSONModel({
				"state": true
			})
			this.getView().setModel(myStateModel, "myStateModel");

		},

		onBeforeRendering: function() {

		},

		reApplyMyFilter: function(oEvent) {

			//Gathering Switch State
			var ftrSwtch = this.getView().getModel("myStateModel"),
				state = ftrSwtch.getData().state;
			
			//Loading local dataStore.json
			
			var dsData = this.getView().getModel("dataStore").getData();

			var aFilter = [new Filter("Deleted", FilterOperator.EQ, "false")];
		
			if (state) {
				aFilter.push(new Filter("Listname", FilterOperator.Contains, dsData.Listname));
				
			} else {

			}

			this.refreshTable(aFilter);
	
		},

		onPressAdd: function(oEvent) {

			var today = new Date();
			var oData = this.getView().getModel();
			var dataStore = this.getView().getModel("dataStore").getData();

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
						
			//Generating new item for output array
			var newBlob = {
				Title: newItem,
				Description: "Edit Description",
				Duedate: newDate,
				Assignedto: "",
				Listname: dataStore.Listname
			};

			//Pushing new item into the array - CREATE METHOD
			this.getView().getModel().create("/ToDoListSet", newBlob, {
				success: function () {
					this.getView().getModel("addFields").setData({Title: "", Duedate: today});		
					this.reApplyMyFilter();
				}.bind(this), 
				error: function (oError) {
					console.log(oError);
				}
			})
			
			//Refocusing user input to title box
			this.getView().byId("inputBox").focus();
		},

		onPressEdit: function(oEvent) {

			//Retrieving row on button location
			var eventBC = oEvent.getSource().getBindingContext("myItems");
			var sObject = eventBC.getObject();

			//Initilise fragment
			this.returnEditFragment();

			var fragData = new JSONModel(sObject);
			this._editFrag.setModel(fragData, "fragModel");
			this._editFrag.open();
		},

		onPressInfo: function(oEvent) {

			this.returnInfoFragment();
			
			this._infoFrag.open();
		},
		
		returnEditFragment() {

			if (!this._editFrag) {
				this._editFrag = sap.ui.xmlfragment(this.getView().getId(), "testwebapptestWebApp.view.fragments.EditView1", this);
				this.getView().addDependent(this._editFrag, this);
			}

			return this._editFrag

		},

		returnInfoFragment() {

			if (!this._infoFrag) {
				this._infoFrag = sap.ui.xmlfragment(this.getView().getId(), "testwebapptestWebApp.view.fragments.InfoView1", this);
				this.getView().addDependent(this._infoFrag, this);
			}

			return this._infoFrag

		},

		handelPriority: function(dueDate) {
			var today = new Date("M/D/YYYY");
			if (dueDate > today) {
				var diffDays = dueDate.diff(today, "days");
			}
			return diffDays;
		},

		onPressSaveDialog: function() {
			
			var oDialog = this._editFrag,
				oModel = oDialog.getModel("fragModel"),
				oData = oModel.getData(),
				line = oData.Id;

			//Update Method here!
			this.getView().getModel().update("/ToDoListSet(" + line + ")", oData, {
				success: function () {		
					this.reApplyMyFilter();
				}.bind(this), 
				error: function (oError) {
					console.log(oError);
				}
			})

			//oDialog.close();

			var msg = "Item Saved";
			MessageToast.show(msg);

		},

		onPressCloseDialog: function() {

			if (this._editFrag) {
				this._editFrag.close();
			}

			if (this._infoFrag) {
				this._infoFrag.close();
			}
		},

		onPressRemove: function(oEvent) {

			//Retrieving row on button location
			var eventBC = oEvent.getSource().getBindingContext("myItems");
			var sObject = eventBC.getObject();
			var line = sObject.Id;

			//Removing row from table data and setting at model - REMOVE method here!
			this.getView().getModel().remove("/ToDoListSet(" + line + ")", {
				success: function () {		
					this.reApplyMyFilter();
				}.bind(this), 
				error: function (oError) {
					console.log(oError);
				}
			})
			
			var msg = "Line " + line + " Removed";
			MessageToast.show(msg);
			
		},

		editSaveFocus: function() {
			this.getView().byId("editSave").focus();
		},

		refreshTable: function(filter=[new Filter("Deleted", FilterOperator.EQ, "false")]) {			

			this.getView().getModel().read("/ToDoListSet", {
				filters : filter,
				success: function(data){
					console.log(data);
					var myModel = new JSONModel(data);
					this.getView().setModel(myModel, "myItems");
					
				}.bind(this),
				error: function(oError) {
					console.log(oError);
				}
			})
			
		},

		firstTimeFilter: function() {

			//Gathering Switch State
			var ftrSwtch = this.getView().getModel("myStateModel"),
				state = ftrSwtch.getData().state;

			//Loading local dataStore.json
			this.getOwnerComponent().getModel("dataStore").attachRequestCompleted(function(oEvent) {
				var dsData = oEvent.getSource().getData();

				var aFilter = [new Filter("Deleted", FilterOperator.EQ, "false")];
			
				if (state) {
					aFilter.push(new Filter("Listname", FilterOperator.Contains, dsData.Listname));
					
				} else {

				}

				this.refreshTable(aFilter);

			}.bind(this));

		},

		onAfterRendering: function() {

			this.firstTimeFilter();
					
		}
	});
});