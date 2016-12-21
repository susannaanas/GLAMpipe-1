

//var base_url = context.node.params.url;
var base_url = "http://api.elsevier.com/content/search/scopus";
var test = "&query=AF-ID%2860007154%29&view=complete";

// variables for node
context.vars = {};
context.vars.record_counter = 0;
context.vars.offset = 25;

// init record limiter
context.vars.limit = parseInt(context.node.settings.limit); 
if (context.vars.limit <= 0 || isNaN(context.vars.limit)) 
	context.vars.limit = 999999999; 


if(context.node.settings.apikey == "") { 
	out.say("error", "You must give an API key!"); 
	context.init_error = "API key missing"; 
} else {

	out.say("news", out.url); 
}

// if limit is less than default offset, then fetch only to limit
if(context.vars.limit < context.vars.offset)
	context.vars.offset = context.vars.limit;

out.url = base_url + "?apikey=" + context.node.settings.apikey + test;

