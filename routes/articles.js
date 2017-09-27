var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require("body-parser");
var app = express();
var path = require('path');
router.get('/', function(req, res, next) {
    res.send('请使用post方式提交')
})

class CreateHtml {
    constructor(options) {
        this.html = options.content;
        this.title = options.title || '';
        this.pageId = options.pageId;
    }
    handlerHtml() {
        var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta content="telephone=no" name="format-detection">
    <title>${this.title}</title>
    <script type="text/javascript" src="https://s.56qq.com/staticBase/dist/20170421/js/flexible.js"></script>
    <link rel="stylesheet" type="text/css" href="https://s.56qq.com/staticBase/dist/20170421/css/wlqq.css"/>
    <style>

        body {
            padding: 0.26rem;
        }

        p {
            padding: 0.13rem;
            font-size: 0.37rem
        }

        .title {
            font-size: 0.48rem;
            text-align: center;
            font-weight: 700
        }

        .subtitle {
            font-size: 0.48rem;
            text-align: center
        }
    </style>
</head>
<body>
    ${this.html}
</body>
</html>`;
        return html;
    }
    getProfile(cb) {
        var pageName = this.pageId || 'index'
        var data = this.handlerHtml();
        fs.writeFileSync('assets/' + pageName + '.html', data);
        cb();
    }
}

app.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const obj = {
        status: 'OK',
        msg: ''
    }
    var query = req.body;
    console.log(query)
    if (query.content) {
        var profile = new CreateHtml(query);
        profile.getProfile(() => {
            obj.msg = '上传成功';
            res.send(obj);
        })
    } else {
        obj.msg = '不能为空'
        res.send(obj);
    }
})

router.get('/download/:fileName', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // 实现文件下载 
    var fileName = req.params.fileName;
    var filePath = path.join(__dirname, '../assets/' + fileName);
    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + fileName,
            'Content-Length': stats.size
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.end(404);
    }
});

module.exports = router;