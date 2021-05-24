

$(document).ready(function() {
	
	$('#invite-success').hide();
	$('#revoke-invite-request-success').hide();
	$('#revoke-invite-success').hide();
	$('#invite-error').hide();
	$('#revoke-invite-request-error').hide();
	$('#revoke-invite-error').hide();
	var timeToRefresh = 2000;
	var timeToFade = 500;
	var timeToFadeInFadeOut = timeToRefresh-2*timeToFade;
	
	$('input[class="isAdminCheckbox"]').bootstrapToggle();
	$('input[class="isAdminCheckbox"]').change(function() {
      if($(this).prop('checked')==true){
			updateAdmin($(this).attr("name"),true,$('.adminUsername').val(),$('.inpCsrfToken').val());
	  }else{
			updateAdmin($(this).attr("name"),false,$('.adminUsername').val(),$('.inpCsrfToken').val());
	  }
    });

	$('.btnSendInvitation').click(function(){
		sendInvite($('.manualInviteEmail').val(),$('.inpCsrfToken').val(),1,"").done(function(result){			
			$.when(fadeInAndOut($('#invite-success'))).done(function(){
			setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});		 
		}).fail(function() {
    		$.when(fadeInAndOut($('#invite-error'))).done(function(){
				setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});
		});	
	});	
	
	$('.delete-user').click(function(){
		deleteUser($(this).children("input[name='username']").val(),$(this).children("input[name='email']").val(),$('.inpCsrfToken').val());
	});
	
	$('.deleteInvitation').click(function(){	
		
		deleteInvitation($(this).children("input[name='code']").val(),$('.inpCsrfToken').val(),$(this).children("input[name='email']").val()).done(function(result){		
			$.when(fadeInAndOut($('#revoke-invite-success'))).done(function(){
			setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});		 
		}).fail(function() {
    		$.when(fadeInAndOut($('#revoke-invite-error'))).done(function(){
			setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});
		});
	});
	
	$('.deleteInvitationRequest').click(function(){	
		deleteInvitationRequest($(this).attr("id"),$('.inpCsrfToken').val(),$(this).children("input[name='email']").val(),$(this).children("input[name='reason']").val(),true).done(function(result){		
			$.when(fadeInAndOut($('#revoke-invite-request-success'))).done(function(){
			setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});		 
		}).fail(function() {
    		$.when(fadeInAndOut($('#revoke-invite-request-error'))).done(function(){
				setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});
		});
	});
	
	/*LOG TABLE METHODS*/
	
	$('.searchWithFilter').click(function(){
		var panelBody = $(this).closest(".panel-heading").next('.panel-body');
		if(panelBody.hasClass('open')){	
			showLogs($(this).closest(".panel-heading"));
		}else{
			showLogs($(this).closest(".panel-heading"));
			toggleBodyElement($(this));
			panelBody.removeClass('closed');
			panelBody.addClass('open');
			toggleOpenCloseFilterIcons($(this).closest(".panel-heading").find('.toggleLog'));
		}
	});
	
	$('.openFilter').click(function(){
		$(this).closest('.panel-heading').find('.logFilterContainer').slideToggle();
	});
	
	$('.toggleLog').click(function(){
		var panelBody = $(this).closest(".panel-heading").next('.panel-body');
		if(panelBody.hasClass('open')){		
			panelBody.children('.logContainer').html("");
			toggleBodyElement($(this));
			panelBody.removeClass('open');
			panelBody.addClass('closed');
			toggleOpenCloseFilterIcons($(this));
		}else{
			showLogs($(this).closest(".panel-heading"));
			toggleBodyElement($(this));
			panelBody.removeClass('closed');
			panelBody.addClass('open');
			toggleOpenCloseFilterIcons($(this));
		}
	});
	
	function toggleOpenCloseFilterIcons(button){
		var panelBody = button.closest(".panel-heading").next('.panel-body');
		if(panelBody.hasClass('open')){		
			button.children("span").removeClass("glyphicon-eye-open");
			button.children("span").addClass("glyphicon-eye-close");
		}else{
			button.children("span").addClass("glyphicon-eye-open");
			button.children("span").removeClass("glyphicon-eye-close");
		}
	}
	
	function showLogs(filterContainer){
		var filters = new Array();
		filterContainer.find('.logFilter').each(function(){		
			if($(this).val()!="" && $(this).val()!=" " && $(this).val()!="-"){
				filters.push($(this).val());
			}else{
				filters.push("null");
			}
		});
			
		var limit = filterContainer.find('.limitFilter').val();
		filterContainer.next('.panel-body').children('.logContainer').html("");
		openLog(filterContainer.find('.pdoName').val(),filterContainer.next('.panel-body').children('.logContainer'),$('input[name="csrf"]').val(),filters,limit);
	}
	
	$('.acceptInvitationRequest').click(function(){
		sendInvite($(this).children("input[name='email']").val(),$('.inpCsrfToken').val(),0,$(this).children("input[name='reason']").val());
		deleteInvitationRequest($(this).attr("id"),$('.inpCsrfToken').val(),$(this).children("input[name='email']").val(),$(this).children("input[name='reason']").val(),false).done(function(result){		
			$.when(fadeInAndOut($('#revoke-invite-request-success'))).done(function(){
			setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});		 
		}).fail(function() {
    		$.when(fadeInAndOut($('#revoke-invite-request-error'))).done(function(){
				setTimeout(function(){
					location.reload();
				},timeToRefresh);
			});
		});
	});
	
	function sendInvite(email,csrf,manualInvite,reason){
		var sucessfull = false;
		var emailData = new Array();
		
		return $.ajax({ 
			type : 'POST',
			data : {email:email,csrf:csrf},
			url  : 'backend/invite.php', 
			success: function ( data ) {				
				sucessfull =  true;
				
				var regex = new RegExp('[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$');

				if (regex.test(data)) {
					console.log("regex tested successuflly");
					emailData.push({
						'email': email,
						'code': data,
						'AdminUser':$('.adminUsername').val(),
						'Reason':reason
					});
					if(manualInvite==1){
						writeLog("SendInvitation",emailData);
					}else{
						writeLog("AcceptInvitationRequest",emailData);	
					}
					sendEmail("SendInvitation",emailData);
				}else{
					console.log(data);
					console.log("regex tested error");
				}
			
			},
			error: function ( xhr ) {
				sucessfull = false;
			}
	    });
	}
	
	function deleteInvitation(code,csrf,email){
		var sucessfull = false;
		console.log(email);
		var emailData = new Array();
		emailData.push({
			'email': email
			
		});
		return $.ajax({ 
			type : 'POST',
			data : {code:code,csrf:csrf},
			url  : 'backend/revokeInvite.php',              
			success: function ( data ) {				
				sucessfull =  true;
				var logData = new Array();
				logData.push({
					'Email': email,
					'Code': code,
					'AdminUser':$('.adminUsername').val()
				});
				writeLog("DeleteInvitation",logData);	
				sendEmail("DeleteInvitation",emailData);
			},
			error: function ( xhr ) {
				sucessfull = false;
			}
	    });
	}
	
	function deleteInvitationRequest(id,csrf,email,reason,sendMail){
		var sucessfull = false;
		var emailData = new Array();
		emailData.push({
			'email': email,
			'AdminUser':$('.adminUsername').val(),
			'Reason':reason
		});
		return $.ajax({ 
			type : 'POST',
			data : {id:id,csrf:csrf},
			url  : 'backend/deleteInvitationRequest.php',              
			success: function ( data ) {
				writeLog("DeleteInvitationRequest",emailData);	
				if(sendMail == true){
					sendEmail("DeleteInvitationRequest",emailData);
				}
				sucessfull =  true;
			},
			error: function ( xhr ) {
				sucessfull = false;
			}
	    });
	}
	
	function deleteUser(username,email,csrf){
		var emailData = new Array();
		emailData.push({
			'Email': email
		});
		var logData = new Array();
		logData.push({
			'Username': username,
			'AdminUser':$('.adminUsername').val()
		});
		return $.ajax({ 
			type : 'POST',
			data : {username:username,csrf:csrf},
			url  : 'delete-user.php',              
			success: function ( data ) {
				writeLog("DeleteUser",logData);	
				sendEmail("DeleteUser",emailData);
				refreshPageAfterAlert();
				sucessfull =  true;
			},
			error: function ( xhr ) {
				sucessfull = false;
			}
	    });
	}
	
	function updateAdmin(username,isAdmin,adminUser,csrf){
		
		if(isAdmin==true){
			isAdmin=1;
		}else{
			isAdmin=0;
		}
		var logData = new Array();
		logData.push({
			'Username': username,
			'IsAdmin': isAdmin,
			'AdminUser':adminUser
		});
		$.ajax({ 
			type : 'POST',
			data : {username:username,isAdmin:isAdmin,adminUser:adminUser,csrf:csrf},
			url  : 'backend/updateAdmin.php',              
			success: function ( data ) {
				writeLog("UpdateUserPrivileges",logData);
				console.log(data);
			},
			error: function ( xhr ) {
				console.log("error");
			}
	    });
	}
	
	function fadeInAndOut(element){
		element.fadeIn(timeToFade).delay(timeToFadeInFadeOut).fadeOut(timeToFade).promise();
	}

});


