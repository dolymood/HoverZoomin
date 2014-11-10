HoverZoomin
===========

## 鼠标hover放大组件 HoverZoomin

在容器元素内，鼠标hover到子元素上放大，不超出容器

### 基本配置使用：

```js
var hoverZoomin = new HoverZoomin('.container', {
	// hover元素的选择器
	selector: '.hzi-item',

	// 达到状态
	// 需要设置下zIndex
	hziTo: {
		width: 300,
		height:300,
		zIndex: 5
	}
});
```

当鼠标放到元素上之后，目标元素会增加class：`hzi-enter`

兼容性：

_IE7+（IE6未测试），其他浏览器_

编码风格：

_用的tab，tab大小为2个空格_

协议：

_[MIT](https://github.com/dolymood/HoverZoomin/blob/master/LICENSE)_