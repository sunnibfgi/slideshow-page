(function() {
	var page = $('page')
	var arrow = $('arrow')
	var mask = $('mask')

	var scrollpage = $('scroll-page')
	var section = page.querySelectorAll('.section')
	var animate = false
	var idx = 0
	var diffY = diffX = 0
	var isMoving = true
	var startY = startX = null

	function $(name) {
		return document.getElementById(name)
	}

	function setCurrent(el) {;
		[].forEach.call(section, function(el) {
			el.classList.remove('current')
		}) 
		;!el.classList.contains('current') && el.classList.add('current') 
		;!scrollpage.classList.contains('anim') && scrollpage.classList.add('anim')

	}

	function initPage() {
		var wh = window.innerHeight
		page.style.cssText = 'overflow:hidden;height:' + wh + 'px'
		scrollpage.style.cssText = 'height:' + section.length * wh + 'px;-webkit-transform:translateY(0);transform:translateY(0);';
		[].forEach.call(section, function(el, i) {
			if (!i) el.classList.add('current')
			el.style.height = wh + 'px'
		})
		idx = 0
	}

	function tourSlides(dir) {
		var len = section.length
		var wh = window.innerHeight;
		!animate && (animate = true)
		dir = dir || 'next'
		idx = dir == 'next' ? Math.min(idx + 1, len - 1) : Math.max(0, idx - 1)
		scrollpage.style.cssText = 'transform:translateY(-' + idx * wh + 'px)'
		setCurrent(section[idx])
	}

	function arrowTapHandler(e) {
		e.stopPropagation()
		if (animate) return
		tourSlides()
	}

	function transitionEnd() {
		animate = false
		var len = section.length
		if (idx == len - 1)
			arrow.classList.add('hide')

		else
			arrow.classList.remove('hide')

	}

	function touchStart(e) {
		var target = e.target
		if (page.contains(e.target) && target.nodeName !== 'A') {
			e.preventDefault()
		}
		if (e.touches.length == 1) {
			startY = e.touches[0].pageY
			startX = e.touches[0].pageX
			isMoving = true
		}
	}

	function touchMove(e) {
		if (isMoving) {
			var y = e.touches[0].pageY
			var x = e.touches[0].pageX
			diffY = startY - y
			diffX = startX - x
		}
	}

	function touchEnd(e) {
		if (!diffY || animate || !page.contains(e.target)) return
		if (Math.abs(diffX) < Math.abs(diffY) && Math.abs(diffY) > 30) {
			if (diffY > 0) {
				tourSlides()
			} else {
				tourSlides('prev')
			}
		}
		animate = isMoving = false
		diffY = diffX = 0
	}

	function adjustPosition(el) {
		el.style.marginLeft = '-' + el.offsetWidth / 2 + 'px'
		el.style.marginTop = '-' + el.offsetHeight / 2 + 'px'
	}

	function show(el, e) {
		e.stopPropagation()
		el.classList.remove('hide')
		mask.classList.remove('hide')
		adjustPosition(el)
	}

	function hide(el, e) {
		e.stopPropagation()
		el.classList.add('hide')
		mask.classList.add('hide')

	}

	var rules = function() {
		var rule = page.querySelectorAll('[data-id=rule]')
		var close = document.querySelectorAll('[data-id=close]')

		return {
			showDialog: function() {
				for (var i = 0; i < rule.length; i++) {
					rule[i].addEventListener('touchstart', function(e) {
						e.stopPropagation()
						var f = this.getAttribute('data-for')
						show($(f), e)
						adjustPosition($(f))
					}, false)
				}
				return this
			},
			hideDialog: function() {
				for (var i = 0; i < close.length; i++) {
					close[i].addEventListener('touchstart', function(e) {
						e.stopPropagation()
						var f = this.getAttribute('data-for')
						hide($(f), e)
					}, false)
				}
				return this
			}
		}
	}()

	initPage()
	rules.
  showDialog().hideDialog()

	window.addEventListener('resize', initPage, false)
	document.addEventListener('touchstart', touchStart, false)
	document.addEventListener('touchmove', touchMove, false)
	document.addEventListener('touchend', touchEnd, false)
	scrollpage.addEventListener('transitionend', transitionEnd, false)
	arrow.addEventListener('touchstart', arrowTapHandler, false)

})()
