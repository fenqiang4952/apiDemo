var cheerio = require('cheerio')

// ES6 定义一个类
class Movie {
    constructor() {
        // 分别是电影名/评分/引言/排名/封面图片链接
        this.name = ''
        this.score = 0
        this.quote = ''
        this.ranking = 0
        this.coverUrl = ''
    }
}

// 引入 log 函数
var log = require('./utils').log
var cached_url = require('./utils').cached

var movieFromDiv = function(div) {
    var e = cheerio.load(div)
    // 创建一个电影类的实例并且获取数据
    var movie = new Movie()
    // 获取 .title 标签的 innerText
    movie.name = e('.title').text()
    movie.score = e('.rating_num').text()
    movie.quote = e('.inq').text()

    var pic = e('.pic')
    movie.ranking = pic.find('em').text()
    movie.coverUrl = pic.find('img').attr('src')

    // 添加评论人数
    var ratings = e('.star').find('span').last().text()
    movie.ratings = ratings.slice(0, -3)
    return movie
}

var moviesFromUrl = function(url) {
    // 把数据缓存起来
    var body = cached_url(url)
    var e = cheerio.load(body)
    // 一共有 25 个 .item
    var movieDivs = e('.item')
    // log('debug', movieDivs[0])
    var movies = []
    for (var i = 0; i < movieDivs.length; i++) {
        var div = movieDivs[i]
        // 获取到 div 的 html 内容
        // 然后扔给 movieFromDiv 函数来获取到一个 movie 对象
        var m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}

// 下载封面图
var downloadCovers = function(movies) {
    var request = require('request')
    var fs = require('fs')
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i]
        var url = m.coverUrl
        var path = m.name.split('/')[0] + '.jpg'
        // log('url ', typeof url, url)
        request(url).pipe(fs.createWriteStream(path))
    }
}

var __main = function() {
    var movies = []
    for (var i = 0; i < 10; i++) {
        var start = i * 25
        var url = 'https://movie.douban.com/top250?start=' + start
        var ms = moviesFromUrl(url)
        // 把 ms 数组里面的元素都添加到 movies 数组中
        movies = movies.concat(ms)
    }
    var utils = require('./utils')
    utils.save('skyeMovies.json', movies)
    // 下载封面图片
    // downloadCovers(movies)
}

__main()
