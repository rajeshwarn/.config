document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend',formulario);


var time_valuation = parseInt(localStorage.time_valuation);

if (!time_valuation || isNaN(time_valuation)) time_valuation = 0;

var form_valuation = document.querySelector("#form_valuation");

if (form_valuation) {
	if (parseInt(localStorage.time_valuation, 10) % 70 == 0) {
		document.querySelector('#form_valuation').style.left = "";
		document.querySelector("#form_valuation #button_panel").innerHTML = "-";
	} else {
		document.querySelector('#form_valuation').style.left = "-200px";
		document.querySelector("#form_valuation #button_panel").innerHTML = "+";
	}
}

localStorage.time_valuation = ++time_valuation;

function close_valuation() {
	document.querySelector("#valuation_text").value = '';
	document.querySelector("#id_last_valuation").value = '';
	document.querySelector("#valuation_comment_panel").style.display = "none";
	document.querySelector("#form_valuation").style.left = "-200px";
	document.querySelector('#form_valuation #button_panel').innerHTML = "+";
	document.querySelector("#valuation_congrat").style.display = "none";
	document.querySelector("#valuation_panel").style.display = "block";
}

function valuation_request_comment(data) {
	document.querySelector("#id_last_valuation").value = data.id;
	document.querySelector("#valuation_panel").style.display = 'none';
	document.querySelector("#valuation_comment_panel").style.display = 'block';
}