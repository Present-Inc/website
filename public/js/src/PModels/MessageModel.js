/**
 * FeedbackModel
 * @class
 */

PModels.factory('FeedbackModel', function() {
	return {
		create : function(style, message, visible) {

			/**
			 * @constructor
			 * @param {String} style - Sets the css class for the Feedback
			 * @param {Boolean} visible - Sets the visibility of the Feedback
			 * @param {Object} message - The feedback content
			 */

			function Feedback(style, visible, message) {
				this.style = style || 'modal';
				this.visible = visible;
				this.title = message ? message.title : '';
				this.body = message ? message.body : '';
				this.options = message ? message.options : [];
			}

			Feedback.prototype.show = function(style, message) {

				if(style && message.body) {
					this.style = style;
					this.body = message.body;
					this.title = message.title;
					this.options = message.options;
					this.visible = true;
				}

			};

			Feedback.prototype.clear = function() {
				this.visible = false;
				this.body = '';
				this.title = '';
				this.options = []
			};

			return new Feedback(style, message, visible);

		}
	}
});