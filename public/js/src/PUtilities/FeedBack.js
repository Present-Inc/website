

PUtilities.factory('Feedback', function() {
	return {
		create : function() {

			function Feedback() {
				this.enabled = false;
				this.message = ''
			}

			Feedback.prototype.show = function(message) {
				this.message = message;
				this.enabled = true;
			};

			Feedback.prototype.hide = function() {
				this.enabled = false;
				this.message = '';
			};

			return new Feedback();

		}
	}
});