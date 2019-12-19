var es = function(selector) {
    return document.querySelectorAll(selector)
}

"use strict"

const request = require('request')
const cheerio = require('cheerio')

function Movie() {
    this.name = ''
    this.score = 0
    this.quote = ''
    this.ranking = 0
    this.coverUrl = ''
}

function tmp() {
    this.num = 0
    this.data = []
}

const log = function() {
    return console.log.apply(console, arguments)
}

const movieFromDiv = function(div) {
    const movie = new Movie()
    const e = cheerio.load(div)
    movie.name = e('.title').text()
    movie.score = e('.rating_num').text()
    movie.quote = e('.inq').text()

    const pic = e('.pic')
    movie.coverUrl = pic.find('img').attr('src')
    movie.ranking = pic.find('em').text()
    return movie
}

const saveMovies = function(movies) {
    const fs = require('fs')
    const path = 'douban.txt'
    const s = JSON.stringify(movies, null, 2)
    fs.appendFile(path, s, function(err) {
        if (err !== null) {
            log("****写入错误",err)
        } else {
            log("保存成功")
        }
    })
}
const moviesFromUrl = function(url) {
    request(url, function(error, response, body) {
        if(error == null && response.statusCode == 200) {
            const e = cheerio.load(body)
            const movies = []
            const movieDivs = e('.item')
            for(let i = 0; i < movieDivs.length; i++) {
                let element = movieDivs[i]
                const div = e(element).html()
                const m = movieFromDiv(div)
                log(m)
                movies.push(m)
            }
            saveMovies(movies)
        }
    })
}



const __main = function() {
    for(let i = 0; i < 10; i++) {
        if(i == 0) {
            moviesFromUrl('https://movie.douban.com/top250')
        } else {
            url = 'https://movie.douban.com/top250?start='+i*25+'&filter='
            moviesFromUrl(url)
        }
    }
}

__main()
