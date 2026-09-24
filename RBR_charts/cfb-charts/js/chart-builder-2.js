/*
 * Embed loader for the RBR chart builders.
 *
 * Posts embed the charts as raw HTML: four <script src> tags (Chart.js,
 * chartjs-plugin-datalabels, patternomaly, this file) and an inline script
 * that fetches the season JSON and calls teamLines(), playMap(), etc. That
 * relies on the tags running in order. SB Nation's current front end
 * re-inserts post markup with JavaScript, and scripts inserted that way are
 * async: they run in whatever order they finish downloading. Datalabels runs
 * before Chart.js and dies on `Chart.helpers`, the builder runs before
 * Chart.js and dies on `Chart.defaults`, the inline script runs before the
 * builder and dies on "teamLines is not defined" — and the post is blank.
 *
 * So this file no longer holds the chart code. It waits for Chart.js (loading
 * its own copy only if the page's never arrives), loads datalabels and
 * patternomaly if they're missing, then loads the real builder
 * (<this file>-core.js), loads d3 if the post reads its data with d3.csv(),
 * and re-runs the post's inline chart script. Every
 * builder filename ships this same loader, so no post needs editing.
 */
(function () {
    var CHART_JS = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.0/chart.min.js';
    var DATALABELS = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js';
    var PATTERNOMALY = 'https://couchux.github.io/RBR_charts/cfb-charts/js/patternomaly/dist/patternomaly.js';
    var D3 = 'https://d3js.org/d3.v6.min.js';
    // How long to wait on the page's own Chart.js tag before loading ours.
    // Loading a second copy early would swap window.Chart out from under the
    // builder's Chart.defaults styling, so be patient.
    var CHART_JS_GRACE_MS = 8000;

    var me = document.currentScript ||
        document.querySelector('script[src*="/chart-builder"][src$=".js"]');
    var coreSrc = me.src.replace(/(\.js)?(\?.*)?$/, '-core.js');

    // The front end can insert a post's markup more than once (hydration
    // retries), so this loader may run several times. Load the core once.
    var boot = window.__rbrChartBoot = window.__rbrChartBoot || {};
    if (boot[coreSrc]) return;
    boot[coreSrc] = true;

    function chartReady() {
        return typeof window.Chart === 'function' && typeof window.Chart.register === 'function';
    }

    function load(src, done) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = done;
        s.onerror = function () { console.error('RBR charts: failed to load ' + src); };
        document.head.appendChild(s);
    }

    function waitFor(test, timeoutMs, done, onTimeout) {
        var start = Date.now();
        (function tick() {
            if (test()) return done();
            if (Date.now() - start > timeoutMs) return onTimeout();
            setTimeout(tick, 50);
        })();
    }

    function ensureChart(done) {
        if (chartReady()) return done();
        var pageHasTag = [].some.call(document.scripts, function (s) {
            return /chart(\.umd)?(\.min)?\.js/i.test(s.src) && !/datalabels/i.test(s.src);
        });
        if (!pageHasTag) return load(CHART_JS, done);
        waitFor(chartReady, CHART_JS_GRACE_MS, done, function () {
            if (chartReady()) done(); else load(CHART_JS, done);
        });
    }

    // Both register plain globals and nothing registers them with Chart, so a
    // second copy is harmless. Datalabels needs Chart.js first; an early copy
    // on the page may already have thrown and will never define itself.
    function ensureDatalabels(done) {
        if (typeof window.ChartDataLabels !== 'undefined') return done();
        load(DATALABELS, done);
    }

    function ensurePattern(done) {
        if (typeof window.pattern !== 'undefined') return done();
        load(PATTERNOMALY, done);
    }

    // The post's inline script may have run before the builder existed (and
    // thrown), or its fetch may still be in flight and about to succeed. Re-run
    // it with each builder call guarded: every chart function takes the canvas
    // id third, and a canvas that already holds a chart is left alone.
    // The builders' public chart functions, across every version.
    var CHART_FNS = ['teamLines', 'playMap', 'extraMap', 'typeLines', 'rushRate',
        'srXrTeams', 'srXrBars', 'drives', 'players'];
    var CALLS_CHART_FN = new RegExp('(^|[^.\\w$])(' + CHART_FNS.join('|') + ')\\s*\\(');

    function postScripts() {
        return [].filter.call(document.scripts, function (s) {
            if (s.src || s.getAttribute('data-rbr-rerun')) return false;
            var type = (s.type || '').toLowerCase();
            if (type && type !== 'text/javascript') return false;
            return CALLS_CHART_FN.test(s.textContent);
        });
    }

    // 2024-era posts read their data with d3.csv(), from a d3 tag placed after
    // the builder's, so it's as likely to be late as anything else.
    function ensureD3(done) {
        var needsD3 = postScripts().some(function (s) { return /\bd3\./.test(s.textContent); });
        if (!needsD3 || typeof window.d3 !== 'undefined') return done();
        load(D3, done);
    }

    // Posts put the canvases after the script, so wait for the whole document.
    function domReady(done) {
        if (document.readyState !== 'loading') return done();
        document.addEventListener('DOMContentLoaded', done);
    }

    function rerunPostScripts() {
        postScripts().forEach(function (s) {
            var src = s.textContent;
            s.setAttribute('data-rbr-rerun', '1');

            // Shadow each chart function the core defined with a guarded copy.
            // They're top-level consts in the core, so read them by name.
            var names = [], fns = [];
            CHART_FNS.forEach(function (name) {
                var fn;
                try { fn = (0, eval)(name); } catch (e) { return; }
                if (typeof fn !== 'function') return;
                names.push(name);
                fns.push(guard(fn));
            });
            try {
                Function.apply(null, names.concat(src)).apply(window, fns);
            } catch (e) {
                console.error('RBR charts: could not re-run post chart script', e);
            }
        });
    }

    function guard(fn) {
        return function () {
            var id = arguments[2];
            if (typeof id === 'string') {
                var canvas = document.getElementById(id);
                if (!canvas || window.Chart.getChart(canvas)) return;
            }
            return fn.apply(this, arguments);
        };
    }

    ensureChart(function () {
        ensureDatalabels(function () {
            ensurePattern(function () {
                load(coreSrc, function () {
                    domReady(function () { ensureD3(rerunPostScripts); });
                });
            });
        });
    });
})();
