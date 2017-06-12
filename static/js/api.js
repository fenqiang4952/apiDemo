// log
var log = function () {
    console.log.apply(console, arguments);
};

// api API
var api = {}

api.ajax = function (url, method, form, response) {
    var request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function (r) {
            response(r);
        }
    }
    if (method === 'post') {
        var data = JSON.stringify(form);
        request.data = data
    }
    // jquery ajax 函数
    $.ajax(request)
}

api.get = function (url, response) {
    var method = 'get';
    var request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function (r) {
            response(r);
        }
    }
    // jquery ajax 函数
    $.ajax(request)
}

api.fetchMovies = function(success) {
    var url = '/api/movie/all'
    this.get(url, success)
}
