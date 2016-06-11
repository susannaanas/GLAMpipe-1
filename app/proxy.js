var request     = require("request");
const MP 		= require("../config/const.js");
var exports 	= module.exports = {};



/**
 * Create metapipe collection on start up
 * - "metapipe" is only collection that must exist
 * - makes sure that "project_count" exists
 */
exports.proxyJSON = function (url, query, res) {
    if (typeof url === "undefined" || url == "")
        return res.json({"error":"no url"});

	var headers = {
		'User-Agent':       'GLAMpipe/0.0.1',
	}

    url = url + "?query=" + encodeURIComponent(query);
    console.log("PROXY:", url);

	 var options = {
		url: url,
		method: 'GET',
		headers: headers,
		json: true
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body); 
			res.json(body);
		} else {
			console.log("error", error);
			res.json({"error":"could get data via proxy"});
			return;
		}
	});
}