(function () {
	'use strict';

	var root = document.documentElement;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	root.dataset.catalogMotion = 'pending';

	function reveal() {
		root.dataset.catalogMotion = 'ready';
		window.setTimeout(function () {
			if (root.dataset.catalogMotion === 'ready') root.dataset.catalogMotion = 'revealed';
		}, 3500);
	}

	function prepare() {
		var dice = Array.from(document.querySelectorAll('.catalog-dice-scene img'));
		Promise.allSettled(dice.map(function (image) {
			return image.decode ? image.decode() : Promise.resolve();
		})).then(function () {
			window.requestAnimationFrame(reveal);
		});
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, { once: true });
	else prepare();
}());
