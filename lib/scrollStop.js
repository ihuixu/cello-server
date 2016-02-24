require('throttle')

var ScrollStop = function (ele, options) {
	this.ele = ele
	this.$ele = $(ele)
}

ScrollStop.prototype = {
	init: function (ele, options) {
		var _self = this

		_self.registerScrollStop()

		$(window).on('pageshow', function (e) {

			//如果是从bfcache中加载页面，为了防止多次注册，需要先off掉
			e.persisted && _self.$ele.off('touchstart', _self.backEventOffHandler).one('touchstart', _self.backEventOffHandler)
		})

		return _self
	}
	, registerScrollStop: function () {
		var _self = this

		_self.$ele.on('scroll.stop', $.debounce(80, function () {
			_self.$ele.trigger('scrollStop')
		}, false))
	}
	, backEventOffHandler : function () {
		var _self = this

		//在离开页面，前进或后退回到页面后，重新绑定scroll, 需要off掉所有的scroll，否则scroll时间不触发
		_self.$ele.off('scroll.stop')
		_self.registerScrollStop()
	}
	, reSetEle : function (ele) {
		var _self = this

		if(ele){
			_self.ele = ele
		} else {
			ele = _self.ele
		}

		_self.$ele = $(ele)
	}
}

return function (element) {
	element = element || window

	var sStop = new ScrollStop(element).init()

	// 外露一个重新绑定的方法，以便瀑布流类型页面使用
	return {
		reBind: function (ele) {
			sStop.reSetEle(ele)
			sStop.backEventOffHandler()
		}
	}
}
