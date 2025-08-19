/*
	Theory by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	// Breakpoints.
		skel.breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

	// Off-Canvas Navigation.

		// Navigation Panel.
			$(
				'<div id="navPanel">' +
					$('#nav').html() +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left'
				});

		// Fix: Remove transitions on WP<10 (poor/buggy performance).
			if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
                                $('#navPanel')
                                        .css('transition', 'none');

                // Reveal animations on scroll.
                var revealEls = document.querySelectorAll('section, article');
                revealEls.forEach(function(el) {
                        el.classList.add('reveal');
                });

                if ('IntersectionObserver' in window) {
                        var observer = new IntersectionObserver(function(entries, obs) {
                                entries.forEach(function(entry) {
                                        if (entry.isIntersecting) {
                                                entry.target.classList.add('visible');
                                                obs.unobserve(entry.target);
                                        }
                                });
                        }, { threshold: 0.1 });
                        revealEls.forEach(function(el) { observer.observe(el); });
                } else {
                        revealEls.forEach(function(el) { el.classList.add('visible'); });
                }

        });

})(jQuery);
