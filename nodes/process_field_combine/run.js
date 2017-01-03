
var get = context.get; 
var doc = context.doc; 
var settings = context.node.settings; 

// if field is "dotted" (like author.authaname), then we use the first part as a field name
if(settings.field1.indexOf(".") !== -1) {
	var s = settings.field1.split(".");
	var field1_value = doc[s[0]];
} else {
	var field1_value = doc[settings.field1];
}

if(settings.field2.indexOf(".") !== -1) {
	var s = settings.field2.split(".");
	var field2_value = doc[s[0]];
} else {
	var field2_value = doc[settings.field2];
}

var arr = []; 

// if both are arrays, then pair them -> field1_value[0] + field2_value[0] etc.
if(Array.isArray(field1_value) && Array.isArray(field2_value)) {
	var max = Math.max(field1_value.length, field2_value.length);
	for(var i = 0; i < max; i++) {
		if(field1_value[i]) {
			if(field2_value[i]) 
				arr.push(join(field1_value[i], field2_value[i]));
			else
				arr.push(join(field1_value[i], ""));
				
		} else {
			arr.push(join("", field2_value[i]));
		}
				
	}
// if one is array
} else if (Array.isArray(field1_value)) {
	field1_value.forEach(function(element) {
		arr.push(join(element, field2_value));
	})
} else if (Array.isArray(field2_value)) {
	field2_value.forEach(function(element) {
		arr.push(join(field1_value, element));
	})
// else both are strings
} else {
	arr = join(field1_value, field2_value);
}





function join (val1, val2) {
	var str = [];
	str.push(settings.prefix);
	str.push(getKey(settings.field1, val1));
	str.push(settings.after_field1);
	str.push(getKey(settings.field2, val2));
	//str.push(settings.after_field2);
	str.push(settings.suffix);
	return str.join("");
}

// if there is a dot in key
function getKey(key, value) {

	if(key.indexOf(".") !== -1) {
		var arr = key.split('.'); 
		arr.shift();
		while(arr.length && (value = value[arr.shift()])); 
		if(typeof value === 'undefined') return ''; 
		return value; 
	} else {
		return value;
	}
}

if(parseInt(context.count) % 1000 == 0) 
    out.say('progress', context.node.type.toUpperCase() + ': processed ' + context.count + '/' + context.doc_count);

out.setter = {};
out.setter[context.node.params.out_field] = arr;
//out.value = arr.join(""); 
