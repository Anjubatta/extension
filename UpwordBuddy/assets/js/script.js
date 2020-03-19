"use strict";
var siteurl = "https://api.paradisetechsoft.com/api/";

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }
  return '';
}
var upworkwindow = getMeta('savepage-title');
if(!upworkwindow){
	var upworkwindow = document.getElementsByTagName('title')[0].text;
}



/***************submit proposal screen*******************/
if(upworkwindow == 'Submit a Proposal'){
	var companyName = '';
	var freelancerName ='';
	var type = ''
	
			var account_name = document.getElementsByClassName("account-name")[0].innerHTML;
			
			var freelancer = document.querySelectorAll('.ng-binding.active');
			if(freelancer[0]){
				companyName = freelancer[0].innerHTML;
				freelancerName = freelancer[1].innerHTML;
				type = 'company';
			}else{
				type='freelancer';
				freelancerName = account_name;
			}
			
			
 setTimeout(function() {
		var url = window.location.href;
		var jobID = getJobID(url);
		localStorage.jobID = jobID;

		function getJobID(contentURL){
		var urlArrray = contentURL.split("/");
		return urlArrray[6];
		}

		var dropdown = document.getElementById("mySelect"); if(dropdown){ dropdown.remove()} 
		var myDiv = document.getElementsByClassName("up-disintermediation-container")[0];
		var array = CoverList; 

		var selectList = document.createElement("select");
		selectList.setAttribute("id","mySelect"); 
		if(myDiv){
			myDiv.prepend(selectList);	
		}
	

		for(var i = 0; i < array.length;	i++) {    
			var option = document.createElement("option"); 
			option.setAttribute("value", array[i].description);  
			option.text = array[i].title;	
			selectList.appendChild(option);
		} 
		
		var textareacover = document.getElementById("coverLetter");
	
		if (textareacover.value=='') {	
				if(textareacover){
					var Coverletter = array[0].description+'\n\n'+'Thanks & Regards \n'+freelancerName.trim();	
						textareacover.value =Coverletter;
						coverLoad =  'true';
				}
				
		}
		
		selectList.onchange = function() {
			var Coverletter = this.value+'\n\n'+'Thanks & Regards \n'+freelancerName.trim();	
			textareacover.value =  Coverletter;
		}
  }, 2000)
		



var btnSubmit = document.querySelectorAll("a.btn.btn-primary");
if(btnSubmit[0]){
	btnSubmit[0].addEventListener("click", proposalSubmit);
}else{
	var btnSubmit1 = document.getElementsByClassName("btn-primary");
	if(btnSubmit1[0]){
		btnSubmit1[0].addEventListener("click", proposalSubmit);
	}
	
}


function proposalSubmit() {
	var jobConnects ='';
	var freelancerConnect = '';
	var companyConnect = '';
	var jobConnectsHTML = document.querySelectorAll('div.m-md-top.ng-scope');
	
	if(jobConnectsHTML[1]){
		 jobConnects = jobConnectsHTML[1].querySelectorAll('span')[0].querySelectorAll('strong')[0].innerText;
	}else{
		jobConnects = jobConnectsHTML[0].querySelectorAll('.m-sm-bottom span')[0].querySelectorAll('strong')[0].innerText;
		companyConnect = jobConnectsHTML[0].querySelectorAll('div.ng-scope')[2].querySelectorAll('strong')[0].innerText;

		console.log(companyConnect);
	}

	var userConnects = document.querySelectorAll('span.text-muted.ng-binding.ng-scope');
	if(userConnects[0]){
		freelancerConnect = userConnects[0].innerText;
	}
	if(userConnects[1]){
		companyConnect = userConnects[1].innerText;
	}


	var skillhtml = document.querySelectorAll('.o-tag-skill'),i; 
	var skills = []; 
	for (i = 0; i < skillhtml.length; ++i) {
			skills.push(skillhtml[i].innerText)
		};
			var username = biddername;
		
var bidPrice = document.getElementById("chargedAmount").value;
			var params = 'user_name='+username+'&job_id='+jobID+'&budget='+bidPrice+'&jobConnects='+jobConnects+'&freelancerConnect='+freelancerConnect+'&companyConnect='+companyConnect+'&upwork_user_id='+companyName+'&upwork_user_type='+type+'&freelancer_name='+freelancerName+'&skills='+skills+'&link='+url;
			var http = new XMLHttpRequest();
			var url = siteurl+'user_proposals';
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
			http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
					console.log('success');										
					}			
			}
			http.send(params); 
	}
}else{
	var filters = [];
	
	chrome.storage.local.get("searchTags", function(n) {
		 filters = n.searchTags			
	});
		
				
	 setTimeout(function() {
	
	var searchURL = document.getElementsByTagName('base')[0].href;
	var currentURL = window.location.href;
	var queryURL = currentURL.replace(searchURL,'');
	
	if(searchURL='https://www.upwork.com/ab/jobs/search/'){
		
	var btn = document.getElementsByClassName("copyurl")[0];
if(!btn){
	
var btnCopy = document.getElementsByClassName("jobs-found")[0].parentNode;
	var btn = document.createElement("BUTTON");   
	//btn.innerHTML = "Copy Filter";       
	btn.setAttribute("id","btncopyurl"); 
	btn.setAttribute("class","copyurl air-icon-link"); 
	btn.setAttribute("title","Copy Search URL for feed notification"); 
	if(btnCopy){
			btnCopy.after(btn);	
		}
}
		
	btn.onclick = function() {		
		var param = getUrlVars();
		
		var label = decodeURI(param.q);		
		
		var f = $.grep(filters, function(e){ 
			return e.key == label; 
		});
		if(f.length < 1){
			filters.push({key:label,value:queryURL});
		}
		
		console.log(filters);	

		chrome.storage.local.set({
					searchTags: filters
				});	
				btn.innerHTML = 'URL Copied';
	}
			
			
	}		
	 },1000);		
		if(localStorage.jobID == 'test'){
			var param = 'job_id='+jobID+'&status=1';
			var http = new XMLHttpRequest();
			var url = siteurl+'proposals_status';
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
			http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
					console.log('success');										
					}			
			}
			http.send(param); 
		}
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
       // vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
