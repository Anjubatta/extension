
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



function NotifyNewJob(j, t, l) {
    
    if (t.Watcher == !1 || (jobCount = jobCount + j, j > 9 && (j = "9+"), chrome.notifications.create("freshJobs", {
		type: "basic",
		iconUrl: "/assets/icon/logo.png",
		title: "Woow... "+j + " "+l+" jobs found!",
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
		if(jobPage=='searchjobs.html'){
			location.reload();
		}
	});
}

function FatchJobDetails(jobid) {	
	var content ='';
	$.ajax({
		async: !0,
        crossDomain: !0,
        url: "https://www.upwork.com/ab/find-work/jobdetails/slider/"+jobid+'.html',
        method: "GET",
		dataType:"html",
        headers: {
            "x-requested-with": "XMLHttpRequest"
		}
		}).done(function(html) {
		var source = $('' + html + '');		
		content = source.find(".row.air-card-divider-sm").html();	
		detailarr[jobid] = content;		
	});
	
}


function FatchNewJobs(n) {	
    return result.length == 0 ? n : jQuery.grep(n, function(n) { 	
        return n.publishedOn > result[0].publishedOn
	})
}

function FatchRssFeed(n) {				

	
	n && chrome.storage.local.get("feedDetails", function(n) {
        n && n.hasOwnProperty("feedDetails") && (resultf = n.feedDetails)
	});
	n && chrome.storage.local.get("searchResult", function(n) {
        n && n.hasOwnProperty("searchResult") && (result = n.searchResult)
	});	
	
	
	setTimeout(function() {	
	
		var query = $('li.ng-scope.active .searchFilter').attr('data-value');
		var label = $('li.ng-scope.active .searchFilter').text();
			
		url ="https://www.upwork.com/ab/jobs/search/url"+query;
		
		$.ajax({
			async: !0,
			crossDomain: !0,
			url: url,
			method: "GET",
			headers: {
				"x-requested-with": "XMLHttpRequest"
			}
			}).done(function(data) {
			
			var t = FatchNewJobs(data.searchResults.jobs);
			
			t.length > 0 && chrome.storage.sync.get("setting", function(data) {			
				data && data.hasOwnProperty("setting") && NotifyNewJob(t.length, data.setting, label)	
				
					$.each(t, function(key,value) {
					
						var jobid = value.ciphertext;
						FatchJobDetails(jobid);
						
						    setTimeout(function() {
								chrome.storage.local.set({
									feedDetails: detailarr
								});
							 },2000);			 
						}); 
						
			});
			
			
			setTimeout(function() {		  
				result = data.searchResults.jobs;			
				chrome.storage.local.set({
					searchResult: result
				});
				
				if( t.length > 0){					
					pageRelode();
				}
			}, 5000)
			
			
			}).fail(function() {        
			chrome.browserAction.setBadgeText({
				text: "Login Error"
			});
			chrome.browserAction.setBadgeBackgroundColor({
				color: "#f44e42"
			})
		})

	},80);
	
}

var jobCount = 0,skillsArr;

chrome.notifications.onButtonClicked.addListener(function(n, tab) {
    tab == 0 ? (chrome.tabs.create({
        url: "/jobs.html"
	}), chrome.notifications.clear(n)) : chrome.notifications.clear(n)
});

chrome.alarms.onAlarm.addListener(function(n) {
    n.name === "jobsFetch" && FatchRssFeed(!1)
});
result = [];
skillsArr = [];

CreateAlarm();

$(document).on('click',".searchFilter", function(event){
	FatchRssFeed(!0);  
});
