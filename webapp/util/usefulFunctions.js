sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return {

        onInit: function() {
            
        },        

		returnPath: function(key="") {

			var path = "/ToDoListSet"

			if (key !== "") {
				key = "(" + key + ")";
			}

			var fullPath = path + key

			return fullPath

		},

        onAfterRendering: function(){

        }
    };
});