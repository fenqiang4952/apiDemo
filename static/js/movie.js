// echarts
const chartStore = {
    pie: null,
    bar: null,
    line: null,
}

const optionForPie = function(data) {
    var option = {
        title: {
            text: '豆瓣top250地区占比',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '地区占比',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option
}

const optionForArea = function(area) {
    const data = _.map(area, (v, k) => {
        const o = {
            name: k,
            value: v.length,
        }
        return o
    })
    const option = optionForPie(data)
    return option
}

const optionForBar = function(data) {
    const option = {
        title: {
            text: '豆瓣电影 top250 按类型划分',
        },
        xAxis: {
            data: data.axis,
            name: '电影类型',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            name: '电影数量',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForType = function(type) {
    const data = {
        axis: [],
        data: [],
    }
    _.each(type, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    const option = optionForBar(data)
    return option
}

const optionForLine = function(data) {
    const option = {
        title: {
            text: '豆瓣 top250 平均分数'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0]
                var value = params.value
                var s = value[0] + ': ' + value[1]
                return s
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '上映时间',
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '平均分',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            min: 8,
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };
    return option
}

const optionForYear = function(year) {
    const data = _.map(year, (v, k) => {
        const avg = _.meanBy(v, 'score')
        const o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    const option = optionForLine(data)
    return option
}

const renderChart = function(d) {
    const data = d

    const area = _.groupBy(data, 'area')
    const areaOption = optionForArea(area)
    const pie = chartStore.pie
    pie.setOption(areaOption)

    const type = _.groupBy(data, 'type')
    const typeOption = optionForType(type)
    const bar = chartStore.bar
    bar.setOption(typeOption)

    const year = _.groupBy(data, 'year')
    const yearOption = optionForYear(year)
    const line = chartStore.line
    line.setOption(yearOption)
}

const movieJSON = function() {
    var d = $.ajax('skyeMovies.json')
    return d.responseJSON
}

const fetchMovies = function() {
    // 使用 ajax 动态获取数据
    api.fetchMovies(function (d) {
        d = JSON.parse(d)
        renderChart(d)
    })
    // 直接使用 JSON 数据 不从后台获取
    // var d = movieJSON()
    // renderChart(d)
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
        const element = document.getElementById(k)
        const chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchMovies()
}

// $(document).ready() 这个东西是 jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(function() {
    __main()
})
