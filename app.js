// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))
app.use(express.static('crawler'))

const registerRoutes = function(app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        //
        app[route.method](route.path, route.func)
    }
}

// 导入 route/index 的所有路由数据
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

// 导入 route/movie 的所有路由数据
const routeMovie = require('./route/movie')
registerRoutes(app, routeMovie.routes)

var host = 'localhost'
var port = 8000

var server = app.listen(port, host, function () {
    // var host = server.address().address
    // var port = server.address().port
    console.log(`服务器已启动，访问地址为 ${host}:${port}`)
})
