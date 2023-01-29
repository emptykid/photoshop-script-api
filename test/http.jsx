

var $http = (function() {

	// JSON library for javascript, I took from somewhere but i don't remember where i took it.
	"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var n,r,o,u,f,i=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(a)){for(u=a.length,n=0;u>n;n+=1)f[n]=str(n,a)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+i+"]":"["+f.join(",")+"]",gap=i,o}if(rep&&"object"==typeof rep)for(u=rep.length,n=0;u>n;n+=1)"string"==typeof rep[n]&&(r=rep[n],o=str(r,a),o&&f.push(quote(r)+(gap?": ":":")+o));else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(o=str(r,a),o&&f.push(quote(r)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+i+"}":"{"+f.join(",")+"}",gap=i,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var r;if(gap="",indent="","number"==typeof n)for(r=0;n>r;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var n,r,o=t[e];if(o&&"object"==typeof o)for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(r=walk(o,n),void 0!==r?o[n]=r:delete o[n]);return reviver.call(t,e,o)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

	return function(config) {
		var url = (/^(.*):\/\/([A-Za-z0-9\-\.]+):?([0-9]+)?(.*)$/).exec(config.url);
		if(url == null) {
			throw "unable to parse URL";
		}

		url = {
			scheme: url[1],
			host: url[2],
			port: url[3] || (url[1] == "https" ? 443 : 80),
			path: url[4]
		};

		if(url.scheme != "http") {
			throw "non-http url's not supported yet!";
		}

		var s = new Socket();

		if(!s.open(url.host + ':' + url.port, 'binary')) {
			throw 'can\'t connect to ' + url.host + ':' + url.port;
		}

		var method = config.method || 'GET';

		var request = method + ' ' + url.path + " HTTP/1.0\r\nConnection: close\r\nHost: " + url.host;
		var header;

		if(config.payload) {
			if(typeof config.payload === 'object') {
				config.payload = JSON.stringify(config.payload);
				(config.headers = config.headers || {})["Content-Type"] = "application/json";
			}

			(config.headers = config.headers || {})["Content-Length"] = config.payload.length;
		}

		for(header in (config.headers || {})) {
			request += "\r\n" + header + ': ' + config.headers[header] ;
		}

		s.write(request+"\r\n\r\n");

		if(config.payload) {
			s.write(config.payload);
		}

		var data, response, payload, http = {};

		data = s.read();
		while(!s.eof) {
			data += s.read();
		}

		var response = data.indexOf("\r\n\r\n");
		if(response == -1) {
			throw "No HTTP payload found in the response!";
		}

		payload = data.substr(response + 4);
		response = data.substr(0, response);

		var http = /^HTTP\/([\d\.?]+) (\d+) (.*)\r/.exec(response), header;
		if(http == null) {
			throw "No HTTP payload found in the response!";
		}

		http = {
			ver: Number(http[1]),
			status: Number(http[2]),
			statusMessage: http[3],
			headers: {}
		};

		var httpregex = /(.*): (.*)\r/g;

		while(header = httpregex.exec(response)) {
			http.headers[header[1]] = header[2];
		}

		var contenttype = (http.headers["Content-Type"] || http.headers["content-type"] || '').split(";");
		var charset = config.charset || (contenttype[1] ? /charset=(.*)/.exec(contenttype[1])[1] : null);
		if(charset) payload = payload.toString(charset);
		contenttype = contenttype[0];

		if(config.forcejson || contenttype == "application/json") {
			http.payload = JSON.parse(payload);
		} else {
			http.payload = payload;
		}

		return http;
	};
})();

