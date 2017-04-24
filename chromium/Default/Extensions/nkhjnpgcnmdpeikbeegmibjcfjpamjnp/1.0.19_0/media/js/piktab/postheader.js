if (typeof chrome != 'undefined')
{
	$('#btn-account').attr('href', 'https://profile.piktab.com/login/plugin/' + chrome.runtime.id);
	$('#btn-account-layer').show();
}