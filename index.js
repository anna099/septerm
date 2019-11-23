const request = require('request');
const cheerio = require('cheerio');
const spinner = require('char-spinner');

const query = process.argv[2];

if (!query) {
    console.error('septerm requires a search term');
    process.exit(1);
} else {
    search_for(query);
}

function search_for(query) {
    spinner();

    request('https://plato.stanford.edu/search/searcher.py?query=' + query, (err, response, data) => {
        if (err) { console.error(err); }

        if (response.statusCode === 404) {
            console.error('the search request has returned a 404');
            process.exit(1);
        }

        if (response.statusCode === 200) {
            var $ = cheerio.load(data);
            if ($('.search_total')[0].innerText === 'No documents found') {
                console.error('the search request has returned no results');
                process.exit(1);
            } else {
                read_page($('.result_title a')[0].attribs.href);
            }
        }
    });
}

function read_page(url) {
    spinner();

    request(url, (err, response, data) => {
        if (err) { console.log(err); }

        if (response.statusCode === 200) {
            var $ = cheerio.load(data);
            var text = get_text($('#aueditable h1')[0]);
            console.log(text);
        }
    });
}

function get_text(object) {
    var children = object.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].type === 'text') {
            return children[i].data;
        }
    }

    return '';
}
