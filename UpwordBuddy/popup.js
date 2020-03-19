

/******************************************/
/*********Define Global variable***********/
/******************************************/

var siteurl = "https://api.paradisetechsoft.com/api/";
var authURL = "https://api.paradisetechsoft.com/auth/api/";
var biddername = 'Paradise team';
var upworkid = 'Test';
var heading = 'Null';
var discription = 'Null';
var jobTitle = 'Null';
var country = 'Null';
var skills = null;
var currentTab = 'Null';
var coverLoad ='false';


chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
 
  });
}); 

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
	  getCoverLetter();		
  }else{
  
  }
})


if (window.Notification && Notification.permission !== "granted") {
  Notification.requestPermission(function (status) {
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
  });
}

/***************************************************/
/*********On load event jquery**********************/
/***************************************************/

document.addEventListener('DOMContentLoaded', function() {
	auth();
	getSkills();
	//checkBoxes();
 if (localStorage.accessToken) {

					biddername = localStorage.biddername;
					$('#biddername').html(biddername);
 					getCoverLetter();
 	document.addEventListener('click',function(e){ 
			 
			    if(e.target && e.target.id != 'cover'){//do something}
				 console.log(e.target.id);
				   if(e.target.value)
				     {	
						coverClick(e.target.value)
					 }
				   }
			 });
	}
	document.getElementById("deleteCookie").addEventListener("click", deleteAuth);	
 	
 	document.getElementById("skillsList").addEventListener("click", checkboxclick);
});
	
		
function deleteAuth(){
	localStorage.removeItem("accessToken");
	location.reload();
}

function auth(){
if (typeof(Storage) !== "undefined") {

    if (localStorage.accessToken) {
  		console.log('success login');
    } else {
	      $( "#body_section" ).hide();
	      $( "#login_section" ).load( "login.html .container" );
    }
	  
  } else {
   alert("Sorry, your browser does not support web storage...");
  }
}


$(document).on('submit', function (event) {	
  event.preventDefault();
	getAccessToken();
	});

function getAccessToken(){
		var username = $('.username').val();
		var password = $('.password').val();  
	  	var url = authURL+'token/';
	    $.ajax({
	           type: "POST",
	           url: url,
			   contentType: "application/json",
	           data: JSON.stringify({username:username,password:password}), // serializes the form's elements.
	           success: function(data)
	           {
					
					localStorage.accessToken = data.access;
					localStorage.refreshToken = data.refresh;
					localStorage.biddername = username;
					biddername = username;
					$('#biddername').html(username);
					$( "#body_section" ).show();
					$( "#login_section" ).remove();
					getCoverLetter();
	           },
	           error: function (textStatus, errorThrown) {
		           	if(textStatus.status==401){ 
		           		$('.response').html('<p class="error">'+textStatus.responseJSON.detail+'</p>');		           		
		           	}	         
	           	}
		        
	         });
	
}

function getRefreshToken(){
	var url = authURL+'token/refresh/';
	$.ajax({
	           type: "POST",
	           url: url,
			   contentType: "application/json",
	           data: JSON.stringify({refresh:localStorage.refreshToken}), // serializes the form's elements.
	           success: function(data)
	           {
	           		localStorage.accessToken = data.access;						
					getCoverLetter();			
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 		          		
		          		localStorage.removeItem("accessToken");
		           		auth();	
		           	}
		           }
	         });
	
}

/******************************************************/
/*********Get Coverletter from paradise server*********/
/******************************************************/

function getCoverLetter() {
var output  ='';

		$.ajax({
	           type: "GET",
	           url: siteurl+'proposals_v/?format=json',
			   contentType: "application/json",			   
	           beforeSend: function (xhr) {
				    xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.accessToken);
				},
	           success: function(data)
	           {
				   if(data.length>0){
					var Coverletter = data[0].description;
					coverAppend(Coverletter);
					biddername = localStorage.biddername;
					
					for (var i = 0; i < data.length; i++) {
						output += '<option value="'+data[i].id+'" data-details="'+data[i].description+'"> '+data[i].title+'</option>';
					}			

					$('#list').html(output);
					var CoverList = data;
					 biddername = localStorage.biddername;
					
					
					chrome.tabs.executeScript( {
						code: 'var CoverList = '+JSON.stringify(CoverList)+'; var skills = '+JSON.stringify(skills)+'; var biddername="'+biddername+'"; var coverLoad="'+coverLoad+'"'
					}, function() {
						chrome.tabs.executeScript({file: 'assets/js/script.js'});
						chrome.tabs.insertCSS({file: "assets/script.css"});
					}); 
				   }     
							   
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 
		           		getRefreshToken();	
		           	}  }
	         });
		
}


function coverClick(id) {
	
	$.ajax({
	           type: "GET",
	           url: siteurl+'proposals_v/'+id+'?format=json',
			   contentType: "application/json",			   
	           beforeSend: function (xhr) {
				    xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.accessToken);
				},
	           success: function(data)
	           {
	           		//var data = JSON.parse(data);	
					var Coverletter = data.description;
				   coverAppend(Coverletter);					
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 
		           		getRefreshToken();	
		           	}
		           }
	         });

}	


/******************************************************/
/*********Get Feed from paradise server****************/
/******************************************************/

function getSkills(n) {
var checkboxhtml ='';
		var skillsArr ='';
		
		chrome.storage.local.get("skills", function(n) {
					skillsArr = n.skills			
				});
				
		$.ajax({
	           type: "GET",
	           url: 'https://insights.paradisetechsoft.com/api/get/project/Skills',	          
			   contentType: "application/json",
	           success: function(data)
	           {
	$.each(data.response.skills, function(key,value) {
		 var checked = '';
		if (skillsArr.includes(value.name)) {
			 checked = 'checked="checked"';
			}
				checkboxhtml += '<li><input type="checkbox" class="custom-control-input skillscheck" id="customCheck" '+checked+' value="'+value.name+'" name="skills"><label class="custom-control-label" for="customCheck">'+value.name+'</label></li>';
	
	});
document.getElementById("skillsList").innerHTML = checkboxhtml;
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          
		           }
	         });
}

function checkboxclick() {
 var arr = []; 
  $("input:checkbox[name=skills]:checked").each(function() { 
                arr.push($(this).val()); 
            }); 
	saveBoxArray(arr);
	
};


function saveBoxArray(arr) {
  chrome.storage.local.set({'skills': JSON.stringify(arr)});
}

function loadBoxArray() {
   if (localStorage.getItem('skills')) {
   arr = localStorage.getItem('skills');
  }
 
}



/***************************************************/
/*********Copy Title on click button****************/
/***************************************************/

function copyTitle() {

  var copyText = document.getElementById("title");
  copyText.select();
  document.execCommand("Copy");  
}



/********************************************/
/*********Get Discription *******************/
/********************************************/

chrome.tabs.executeScript( {
  code: "document.getElementsByClassName('break')[0].innerText;"
}, function(selection) {
	if(selection){
	  discription = selection[0];  
	}
 });


chrome.tabs.executeScript( {
  code: "document.querySelectorAll('.m-md-bottom.ng-binding')[0].innerText;"
}, function(selection) {
	if(selection){
	  jobTitle = selection[0];  
	}
 
});

/********************************************/
/*********Get country Title *********************/
/********************************************/

chrome.tabs.executeScript( {
  code: "document.querySelectorAll('.m-md-bottom.ng-binding')[0].innerText;"
}, function(selection) {
	if(selection){
	  country = selection[0];  
	}
});
/********************************************/
/*********Get Job skills *********************/
/********************************************/

chrome.tabs.executeScript( {
  code: "var skillhtml = document.querySelectorAll('.o-tag-skill'),i; var skill = []; for (i = 0; i < skillhtml.length; ++i) {skill.push(skillhtml[i].innerText)};skill"
}, function(skill) {
	if(skill){
		skills = skill[0];
		var spans = '';
		for (var i = 0; i < skills.length; i++) {
			spans += '<span>'+skills[i]+'</span>';
		}
		document.getElementById("skillsList").innerHTML = spans;
	}

});




/********************************************/
/*********Get Upwork Id**********************/
/********************************************/

chrome.tabs.executeScript( {
  code: "document.getElementsByClassName('account-name')[0].innerText;"
}, function(selection) {
	if(selection){
		 upworkid = selection[0].trim();
	}
 
});

/******************************************************/
/*********Execute script send data to paradise server**/
/******************************************************/

function coverAppend(Coverletter){
	if(!localStorage.coverLoad){
		
		Coverletter = Coverletter+'\\n\\n'+'Thanks & Regards \\n'+upworkid;
				chrome.tabs.executeScript( {
				  code: 'var letter = "'+Coverletter+'"; var textarea = document.getElementById("coverLetter"); if(textarea){ textarea.value =letter}'
				}, function() {

				});
		localStorage.coverLoad =  true;
	
	}
			
}



/*************************************/
/*********Create URL by Title*********/
/*************************************/


function getFilename(contentURL) {
	var heading = contentURL;
    var links = contentURL.split('?')[0].split('#')[0];
    var name = contentURL.split('?')[0].split('#')[0];
    if (name) {
        name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        
    } else {
        name = '';
    }
	
     return  name;
}



