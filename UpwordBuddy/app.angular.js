"use strict";
function Ctrl($scope) {
    $scope.age = 24;
}

		
var app = angular.module("app", ['ngSanitize']);

app.config(["$compileProvider", function(n) {
    var t = n.imgSrcSanitizationWhitelist(),
        i = t.toString().slice(0, -1) + "|chrome-extension:" + t.toString().slice(-1);
    console.log("Changing imgSrcSanitizationWhiteList from " + t + " to " + i);
    n.imgSrcSanitizationWhitelist(i)
}]);

app.filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  }
});

app.controller("searchController", ["$scope", function(n) {

	n.toggle = [];
	
	
	
n.toggleFilter = function(inx) {
	if(!n.toggle[inx]){
		n.toggle[inx] = false;
	}
	
  n.toggle[inx] = n.toggle[inx] === false ? true : false;
}


	n.deleteKey = function(label) {			
		n.allFeedDetail = $.grep(n.allsearchTags, function(e){ 
			return e.key != label; 
		});
	chrome.storage.local.set({
				searchTags: n.allFeedDetail
			});	
				
	chrome.storage.local.get("searchTags", function(t) {	
        t && t.hasOwnProperty("searchTags") && (n.allsearchTags = angular.copy(t.searchTags), n.$apply())
    });
	
    };
	
    n.allSearchFeed = [];
    n.allsearchTags = [];
    n.allFeedDetail = [];
	

    chrome.extension.sendRequest({
        cmd: "bg_clear_badge"
    });
    chrome.storage.local.get("searchResult", function(t) {	
        t && t.hasOwnProperty("searchResult") && (n.allSearchFeed = angular.copy(t.searchResult), n.$apply())
    });
	
	 chrome.storage.local.get("searchTags", function(t) {	
        t && t.hasOwnProperty("searchTags") && (n.allsearchTags = angular.copy(t.searchTags), n.$apply())
    });
	chrome.storage.local.get("feedDetails", function(a) {
						a && a.hasOwnProperty("feedDetails") && (n.allFeedDetail = angular.copy(a.feedDetails), n.$apply())						
					});
			 
	 chrome.storage.local.get("activeMenu", function(t) {	
        t && t.hasOwnProperty("activeMenu") && (n.activeMenu = angular.copy(t.activeMenu), n.$apply())
    });


	 
	
	n.activeFilter = function(label) {
		n.activeMenu = label	  
		chrome.storage.local.set({
					activeMenu: label
					});				
    }; 
			

}]);
function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

app.controller("feedController", ["$scope", function(n) {

	n.toggle = [];
	
n.toggleFilter = function(inx) {
	if(!n.toggle[inx]){
		n.toggle[inx] = false;
	}
	
  n.toggle[inx] = n.toggle[inx] === false ? true : false;
}
    n.allFeed = [];
    n.allFeedDetail = [];
	

    chrome.extension.sendRequest({
        cmd: "bg_clear_badge"
    });
    chrome.storage.local.get("feedResult", function(t) {	
        t && t.hasOwnProperty("feedResult") && (n.allFeed = angular.copy(t.feedResult), n.$apply())
    })	

}]);

app.controller("settingController", ["$scope", function(n) {
    n.setting = {
        Watcher: !0,
        Sound: !0
    };
    n.IsLogin = !1;
	console.log(n.setting);
    n.SaveFeed = function() {       
        n.setting.Sound = n.setting.Watcher;
		
        chrome.storage.sync.set({
            setting: n.setting
        })
    };
    n.SaveSound = function() {
        n.setting.Watcher == !1 && (n.setting.Sound = !1);
        chrome.storage.sync.set({
            setting: n.setting
        })
    };
    chrome.storage.sync.get("setting", function(t) {
        t && t.hasOwnProperty("setting") && (n.setting = angular.copy(t.setting), n.$apply())
    });
   
}]);
