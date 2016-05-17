var FeedParser = require('feedparser'),
  request = require('request');

module.exports = function(Feed) {
  /**
   *
   * @param {string} id
   * @param {Function(Error)} callback
   */

  Feed.fetch = function(id, callback) {
    Feed.findById(id, function(err, feed) {
      if (feed && feed.id) {
        var req = request(feed.url),
          feedparser = new FeedParser();

        req.on('error', function(error) {
          console.log(error);
          // handle any request errors
        });
        req.on('response', function(res) {
          var stream = this;

          if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

          stream.pipe(feedparser);
        });


        feedparser.on('error', function(error) {
          console.log(error);
          // always handle errors
        });
        feedparser.on('readable', function() {
          // This is where the action is!
          var stream = this,
            meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
            ,
            item;
          feed.meta = meta;
          feed.save();
          while (item = stream.read()) {
            // console.log(item);
          }
        });
        callback(null, feed);
      } else {
        callback("Unable to find feed with ID " + id);
      }
    })
  };
};
