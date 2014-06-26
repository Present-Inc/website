/**
 * FeedbackModel
 * @class
 */

PModels.factory('MessageModel', function() {
	return {
		create : function(type, style, content, visible) {

			/**
			 * @constructor
			 * @oaram {String} type - determines the Message type e.g. modal
			 * @param {String} style - Sets the css class for the Message
			 * @param {Boolean} visible - Sets the visibility of the Message
			 * @param {Object} content - The Message content
			 */

			function Message(type, style, content, visible) {
				if (!style) style = 'primary';
				this.style = [type, style];
				this.visible = visible || false;
				this.title = content ? content.title : '';
				this.body = content ? content.body : '';
				this.options = content ? content.options : [];
			}

			Message.prototype.show = function(content, style) {

				if(content.body) {
					this.style = style || this.style;
					this.body = content.body;
					this.title = content.title;
					this.options = content.options;
				}

				this.visible = true;

			};

			Message.prototype.clear = function() {
				this.visible = false;
				this.body = '';
				this.title = '';
				this.options = []
			};

			return new Message(type, style, content, visible);

		}
	}
});