
var reply = "";
var conn = new Socket();

// access Adobe's home page
if (conn.open ("www.baidu.com:80")) {

    // send a HTTP GET request
    conn.write ("GET / HTTP/1.0\n\n");

    // and read the server's reply
    reply = conn.read(999999);

    conn.close();
}


$.writeln(reply)
