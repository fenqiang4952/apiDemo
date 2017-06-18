var fs = require('fs')

// TODO 没法切换，数据有问题。
var movieFilePath = 'db/movie.json'
// var trueMovieFilePath = 'crawler/skyeMovies.json'
const loadMovies = () => {
    const content = fs.readFileSync(movieFilePath, 'utf8')
    const ms = JSON.parse(content)
    return ms
}

var m = {
    data: loadMovies()
}

m.all = function() {
    var ms = this.data
    return ms
}

module.exports = m
