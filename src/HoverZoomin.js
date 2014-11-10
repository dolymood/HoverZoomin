/**
 * HoverZoomin
 * https://github.com/dolymood/HoverZoomin
 * MIT licensed
 *
 * Copyright (c) 2014 dolymood(aijc.net)
 */

;(function(win, $) {
	'use strict'

	var OPTIONS = {

		// hover元素的选择器
		selector: '.hzi-item',

		// 达到状态
		hziTo: {
			width: 300,
			height:300,
			zIndex: 5
		}

	};

	/**
	 * 鼠标hover放大 但是不超出容器
	 * @param {String|Object} ele    元素选择器或者元素或者jquery封装元素
	 * @param {Object} options       配置项
	 */
	function HoverZoomin(ele, options) {
		this.ele = $(ele);
		this.options = $.extend({}, OPTIONS, options);

		this._curTarget = null;
		this.enterCls = 'hzi-enter';
		this.selector = this.options.selector + ':not(.' + this.enterCls + ')';

		this.init();
	}
	win.HoverZoomin = HoverZoomin;

	$.extend(HoverZoomin.prototype, {

		/**
		 * 初始化
		 */
		init: function() {
			this.ele.delegate(this.selector, 'mouseenter', $.proxy(this._onEnter, this));
			this.ele.delegate(this.selector, 'mouseleave', $.proxy(this._onLeave, this));
		},

		/**
		 * mouseEnter处理函数
		 * @param  {Object} e 事件对象
		 */
		_onEnter: function(e) {
			var _curTarget = $(e.currentTarget);
			var data = _curTarget.data('originInfo');
			if (!data) {
				// 保存data数据
				_curTarget.data('originInfo', {
					width: _curTarget.width(),
					height: _curTarget.height(),

					// 当前元素正在hover
					isCrt: false
				});
				data = _curTarget.data('originInfo');
			}

			if (data.isCrt) {
				return;
			}

			data.isCrt = true;

			// 强制把上次的leave掉
			this._onLeave(null, true);

			this._orTarget = _curTarget;

			this._curTarget = _curTarget.clone(true);

			var curPos = _curTarget.position();
			var that = this;

			// 设置初始样式以及监听事件
			this._curTarget.css({
				position: 'absolute',
				top: curPos.top,
				left: curPos.left
			}).on('mouseenter', function(e) {
				e.stopPropagation();
			}).on('mouseleave', function(e) {
				e.stopPropagation();
				that._onLeave(e, true);
			}).addClass(this.enterCls).appendTo(_curTarget.parent());

			this._setZoomin(curPos);
			
		},

		/**
		 * mouseEnter处理函数
		 * @param  {Object}  e    事件对象
		 * @param  {Boolean} hard 是否强制移除
		 */
		_onLeave: function(e, hard) {
			var _curTarget = this._curTarget;
			var _orTarget = this._orTarget;
			var originInfo;
			if (!_curTarget || !_orTarget) {
				return;
			}
			originInfo = _orTarget.data('originInfo');
			if (!hard && originInfo.isCrt) return;
			this._curTarget.remove();
			this._curTarget = null;
			
			originInfo.isCrt = false;
			this._orTarget = null;
		},

		/**
		 * 设置放大效果
		 * @param  {Object}  pos  target的克隆元素位置
		 */
		_setZoomin: function(pos) {
			var _curTarget = this._curTarget;
			// var pos = _curTarget.position();
			var originInfo = _curTarget.data('originInfo');
			var targetInfo = $.extend({}, this.options.hziTo);
			var diffWidth = targetInfo.width - originInfo.width;
			var diffHeight = targetInfo.height - originInfo.height;

			targetInfo.position = 'absolute';
			targetInfo.left = pos.left - diffWidth / 2;
			targetInfo.top = pos.top - diffHeight / 2;

			// 检验
			this._checkUpdateBounds(targetInfo);

			_curTarget.css(targetInfo);
		},

		/**
		 * 检验边界 并更新位置 左 上优先级比较高
		 * @param  {Object} targetInfo 要移动到的位置信息
		 */
		_checkUpdateBounds: function(targetInfo) {
			var eleWidth = this.ele.outerWidth();
			var eleHeight = this.ele.outerHeight();
			var eleOffset = this.ele.offset();
			var pOffset = this._curTarget.parent().offset();

			var targetLeft = pOffset.left + targetInfo.left;
			var targetTop = pOffset.top + targetInfo.top;
			
			var c1 = targetLeft + targetInfo.width;
			var c2 = eleOffset.left + eleWidth;
			if (c1 > c2) {
				// 右侧超出
				targetInfo.left -= c1 - c2;
			}

			c1 = targetLeft;
			c2 = eleOffset.left;
			if (c1 < c2) {
				targetInfo.left += c2 - c1;
			}

			c1 = targetTop + targetInfo.height;
			c2 = eleOffset.top + eleHeight;
			if (c1 > c2) {
				// 底部超出
				targetInfo.top -= c1 - c2;
			}

			c1 = targetTop;
			c2 = eleOffset.top;
			if (c1 < c2) {
				targetInfo.top += c2 - c1;
			}
		}

	});

	// 支持MD
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = Timeline;
	} else {
		if (typeof define === 'function' && define.amd) {
			define([], function() { return Timeline; });
		}
	}

}(window, jQuery));