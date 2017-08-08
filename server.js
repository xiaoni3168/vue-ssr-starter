const fs = require('fs');
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
const serverInfo = 
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const app = express();

const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8');

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        template,
        basedir: resolve('./dist'),
        runInNewContext: false
    }));
}

let renderer;
let readyPromise;
if (isProd) {
    const bundle = require('./dist/vue-ssr-server-bundle.json');
    const clientManifest = require('./dist/vue-ssr-client-manifest.json');
    renderer = createRenderer(bundle, {
        clientManifest
    });
} else {
    readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
        renderer = createRenderer(bundle, options);
    });
}

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});

app.use(compression({ threshold: 0 }));
app.use('/dist', serve('./dist', true));

function render (req, res) {
    const s = Date.now();

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Server', serverInfo);

    const handleError = err => {
        if (err.url) {
            res.redirect(err.url);
        } else if (err.code === 404) {
            res.status(404).end('404 | Page Not Found');
        } else {
            res.status(500).end('500 | Internal Server Error');
            console.log(`error during render : ${req.url}`);
            console.log(err.stack);
        }
    }

    const context = {
        title: 'Test',
        url: req.url
    };

    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err);
        }
        res.end(html);
        if (!isProd) {
            console.log(`whole request : ${Date.now() - s}ms`);
        }
    });
}

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 9999;
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});