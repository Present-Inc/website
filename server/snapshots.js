
/**
 * Snapshots
 * ====================================================
 */

var presentApi = require('./presentApi');


module.exports = {

	_default: function(req, res) {
		res.render('default_snapshot.ejs');
	},

	user: function(req, res) {

		var params = {username: req.params.user};

		presentApi.users('show', params, function(err, apiResponse) {
			var apiResponseObject = JSON.parse(apiResponse);
			if (err) res.send(404);
			res.render('user_snapshot.ejs', {user: apiResponseObject.result.object});
		});

	},

	video : function(req, res) {

		var params = {video: req.params.video};

		presentApi.videos('show', params, function(err, apiResponse) {
			var apiResponseObject = JSON.parse(apiResponse);
			var openGraph = {
				url   : 'www.present.tv'  + req.url,
				title : apiResponseObject.result.object.title || 'This video was insane.',
				image : apiResponseObject.result.object.mediaUrls.images['480px'] || 'http://www.present.tv/assets/img/app-icon.png'
			};

			if (err) res.send(404);
			res.render('video_snapshot.ejs', {video: apiResponseObject.result.object, openGraph: openGraph});
		});

	}
};