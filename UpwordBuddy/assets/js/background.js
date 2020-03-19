
$(document).ready(function() {	
   chrome.runtime.sendMessage({addressInfo: 'text'});
});
var listings=[];
var detailarr =  {};
function CreateAlarm() {
    chrome.alarms.create("jobsFetch", {        
        periodInMinutes:1
    })
}

function ClearAlarm() {
    chrome.alarms.clear("jobsFetch")
}

function FatchNewJobs(n) {
    return result.length == 0 ? n : jQuery.grep(n, function(n) { 	
        return n.publishedOn > result[0].publishedOn
    })
}

function NotifyNewJob(j, t) {
    
    if (t.Watcher == !1 || (jobCount = jobCount + j, j > 9 && (j = "9+"), chrome.notifications.create("freshJobs", {
            type: "basic",
            iconUrl: "/assets/icon/logo.png",
            title: "Woow... "+j + " new jobs found!",
            message: "Bid on new jobs",
            buttons: [{
                title: "New jobs"
            }, {
                title: "Close"
            }]
        }), chrome.browserAction.setBadgeText({
            text: jobCount.toString()
        }), chrome.browserAction.setBadgeBackgroundColor({
            color: "#f44e42"
        }), t.Sound == !1)) return !0;
    var i = new Audio("/assets/sound/eventually.mp3");
    i.play();

}
function pageRelode(){
chrome.tabs.getCurrent(function(tab){
        var currntTab = tab.url;
		var tabArray =  currntTab.split("/");
		var jobPage = tabArray[3];
		if(jobPage=='jobs.html'){
		 location.reload();
		}
});
}


function FatchRssFeed(n) {				
     n && chrome.storage.local.get("feedResult", function(n) {
        n && n.hasOwnProperty("feedResult") && (result = n.feedResult)
    });
	
	$.ajax({
         async: !0,
        crossDomain: !0,
        url: "https://www.upwork.com/ab/find-work/api/feeds/search",
        method: "GET",
        headers: {
            "x-requested-with": "XMLHttpRequest"
        }
    }).done(function(data) {
		
	    var t = FatchNewJobs(data.results);	  

        t.length > 0 && chrome.storage.sync.get("setting", function(data) {
            data && data.hasOwnProperty("setting") && NotifyNewJob(t.length, data.setting)
			
        });
		
	   setTimeout(function() {
		  
            result = data.results;			
            chrome.storage.local.set({
                feedResult: result
            });
			
			if( t.length > 0){					
				pageRelode();
			}
        }, 2000)
		 
		
    }).fail(function() {        
        chrome.browserAction.setBadgeText({
            text: "Login Error"
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#f44e42"
        })
    })
}


var jobCount = 0,result;

chrome.notifications.onButtonClicked.addListener(function(n, tab) {
    tab == 0 ? (chrome.tabs.create({
        url: "/jobs.html"
    }), chrome.notifications.clear(n)) : chrome.notifications.clear(n)
});

chrome.alarms.onAlarm.addListener(function(n) {
    n.name === "jobsFetch" && FatchRssFeed(!1)
});

result = [];
FatchRssFeed(!0);
CreateAlarm();