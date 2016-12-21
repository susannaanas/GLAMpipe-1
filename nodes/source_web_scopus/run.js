var c = context;

out.value = null;

if (context.response && context.response.statusCode == 200 ) {
	// count query rounds
	c.vars.round_counter++;
	if(c.data["service-error"]) {
		out.say("error", c.data["service-error"].statusText);
	} else if (c.data["search-results"]) {
		var result = c.data["search-results"];
		
		//out.say("progress", opensearch:totalResults);
		c.data["search-results"].entry.forEach(function(entry) {
			
			// remove that nasty "$" that breaks mongo
			entry["author-count"]["count"] = entry["author-count"]["$"];
			delete entry["author-count"]["$"];
			
			entry.authors = [];
			if(entry.author && Array.isArray(entry.author)) {
				entry.author.forEach(function(author) {
					// give user's full name if found
					var author_name = author.authname;
					if(author.surname && author.surname !== "")
						if(author["given-name"] && author["given-name"] !== "")
							author_name = author["given-name"] + " " + author.surname;
					
					entry.authors.push(author_name);
					
					// again remove nasty "$"
					if(author.afid && Array.isArray(author.afid)) {
						author.afid.forEach(function(ele) {
							ele.id = ele["$"];
							delete ele["$"];
						})
					}
				})
			}
			
			if(entry.affiliation && Array.isArray(entry.affiliation)) {
				entry.affiliation.forEach(function(affil) {
					if(affil["name-variant"] && Array.isArray(affil["name-variant"])) {
						affil["name-variant"].forEach(function(ele) {
							ele.variant = ele["$"];
							delete ele["$"];
						})
					}
				})
			}
			context.vars.record_counter++;
		})
		
		// result should be array
		if(Array.isArray(result.entry))
			out.value = result.entry;
		
		var linkIndex = result.link.findIndex(nextLink);
		out.console.log("linkIndex:" + linkIndex);
		if( linkIndex !== -1)
			out.url = result.link[linkIndex]["@href"];
			
	} else {
		out.say("error", "Something went wrong...");
	}

} else {
		out.say("error", "Server responded " + context.response.statusCode);
}

function nextLink (element) {
	return element["@ref"] === "next";
}
