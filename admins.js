$(document).ready(function() {
	
	$('#delete-user-form').submit(function( event ) {
		if (!confirm('Do you really want to delete this user?')) { 
			event.preventDefault();
		}
	});
	
	setTimeout(function() {
        $('#password-error-div').fadeOut( "slow", function() {
			//Animation complete
		});
		$('#password-success-div').fadeOut( "slow", function() {
			//Animation complete
		});
		$("#invite-result").fadeOut( "slow", function() {
			//Animation complete
		});
		$("#revoke-invite-result").fadeOut( "slow", function() {
			//Animation complete
		});
		
    }, 3000);
	
});