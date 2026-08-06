(function () {
    'use strict';

    var nav = document.getElementById('top-nav');
    var toggle = document.getElementById('nav-toggle');
    var mobile = document.getElementById('nav-mobile');
    var year = document.getElementById('year');

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (nav) {
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 8);
        }, { passive: true });
    }

    if (toggle && mobile) {
        toggle.addEventListener('click', function () {
            var open = mobile.hasAttribute('hidden');
            if (open) {
                mobile.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                mobile.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        mobile.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobile.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
})();
