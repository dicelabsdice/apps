(function () {
	'use strict';

	var root = document.documentElement;
	var started = false;
	var preloadFallback;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	root.dataset.catalogMotion = 'pending';

	function reveal() {
		if (started) return;
		started = true;
		window.clearTimeout(preloadFallback);
		root.dataset.catalogMotion = 'ready';
		window.setTimeout(function () {
			if (root.dataset.catalogMotion === 'ready') root.dataset.catalogMotion = 'revealed';
		}, 3500);
	}

	function waitForTemplate() {
		if (!document.body.classList.contains('is-preload')) {
			window.requestAnimationFrame(reveal);
			return;
		}

		var observer = new MutationObserver(function () {
			if (!document.body.classList.contains('is-preload')) {
				observer.disconnect();
				window.requestAnimationFrame(reveal);
			}
		});
		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

		// Keep the catalog reachable if an external template dependency stalls.
		preloadFallback = window.setTimeout(function () {
			observer.disconnect();
			document.body.classList.remove('is-preload');
			reveal();
		}, 5000);
	}

	function prepare() {
		var dice = Array.from(document.querySelectorAll('.catalog-dice-scene img'));
		Promise.allSettled(dice.map(function (image) {
			return image.decode ? image.decode() : Promise.resolve();
		})).then(function () {
			waitForTemplate();
		});
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, { once: true });
	else prepare();
}());
