if (!localStorage.piktab_view) 
{
	localStorage.piktab_view = "true";
}
var piktab_mode = localStorage.piktab_view === "true";

if (!piktab_mode) document.getElementsByTagName('body')[0].classList.remove('piktab-mode');

$(function() {
	if(!piktab_mode) document.getElementById('piktab-view').checked = false;
});