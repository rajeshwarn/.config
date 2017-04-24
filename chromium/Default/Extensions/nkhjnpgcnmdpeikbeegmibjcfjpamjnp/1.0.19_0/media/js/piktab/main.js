$(".loader").show();
check_piktab();
var scrolling = new _scrolling();
var elements_lib = new localStorageDB("library", localStorage);
if (where_document === "chrome-extension:" && navigator.onLine) 
{
	tutorial();
	tutorial_handlers();
	most_visited();
	check_most_visited();
	gr.request.get(gr.auth.base_url + 'request/login', false);
}

localSorage_db_set(elements_lib);
updated_version();
search_init();
load_piktab();
load_event_user_handlers();
homepage_handler();
check_search();
check_mv_counter();
check_el_rot();
first_load = false;

