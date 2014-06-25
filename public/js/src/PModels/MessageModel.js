/**
 * FeedbackModel
 * @class
 */

PModels.factory('MessageModel', function() {
	return {
		create : function(style, content, visible) {

			/**
			 * @constructor
			 * @param {String} style - Sets the css class for the Feedback
			 * @param {Boolean} visible - Sets the visibility of the Feedback
			 * @param {Object} content - The feedback content
			 */

			function Message(style, content, visible) {
				this.style = style || 'modal';
				this.visible = visible;
				this.title = content ? content.title : '';
				this.body = content ? content.body : '';
				this.options = content ? content.options : [];
			}

			Message.prototype.show = function(style, content) {

				if(style && content.body) {
					this.style = style;
					this.body = content.body;
					this.title = content.title;
					this.options = content.options;
					this.visible = true;
				}

			};

			Message.prototype.clear = function() {
				this.visible = false;
				this.body = '';
				this.title = '';
				this.options = []
			};

			return new Message(style, content, visible);

		}
	}
});