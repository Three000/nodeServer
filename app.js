var express = require('express'),
    app = express();

app.get('/', (req, res) => {
    res.send('hello world')
})

var server = app.listen(8030, () => {
    var host = server.address().address;
    var port = server.address().post;
    console.log('Example app listening at http://%s:%s', host, port);
})