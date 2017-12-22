const cheerio = require('cheerio')
const request = require('request')
const df = require('download-file')

function crawlStory (chapterUrl, chapterIndex, saveDir, cb) {
  console.log('crawling', chapterUrl);
  request(chapterUrl, function (err, response, body) {
    if (err) console.log(err);
    // console.log('body', body);
    // console.log('================================');

    const urls = getImageUrls(body);
    const nextChapUrl = getNextChapUrl(body);

    console.log('urls', urls.length);
    console.log('==============');
    // console.log('nextChapUrl', nextChapUrl);

    urls.forEach((url, i) => {
      // console.log('url', url);
      downloadFile(url, saveDir + '/' + chapterIndex, i + '.jpg', function(err) {
        if (err) {
          console.log('fail url', url);
          console.log('fail chapterUrl', chapterUrl);
        }
      });
    })

    if (nextChapUrl) {
      crawlStory(nextChapUrl, ++chapterIndex, saveDir, cb);
    } else {
      cb();
    }
  })
}

function getImageUrls (body) {
  const $ = cheerio.load(body);
  const imgTags = $('.grab-content-chap').find('img');
  const urls = [];

  imgTags.each((i, elem) => {
    urls[i] = elem.attribs.src;
  })

  return urls;
}

function getNextChapUrl (body) {
  const $ = cheerio.load(body);
  return $('a.next').attr('href');
}

function downloadFile(url, dir, name, cb) {
  const options = {
    directory: dir,
    filename: name
  }

  df(url, options, cb)
}




const narutoStoryUrl = 'http://blogtruyenhay.com/naruto/naruto-chap-1';
const saveNarutoDir = './story/naruto';

crawlStory(narutoStoryUrl, 0, saveNarutoDir, function () {
  console.log('====== done ======');
});


// const conanStoryUrl = 'http://blogtruyenhay.com/tham-tu-lung-danh-conan/conan-chap-1';
// const saveConanDir = './conan';
//
// crawlStory(conanStoryUrl, 0, saveConanDir, function () {
//   console.log('====== done ======');
// });
