'use strict';

require("babel-register")({
    extensions: ['.jsx'],
    presets: ['react', 'es2015'],
    plugins: [
        'add-module-exports'
    ]
});

const HandlebarsAdapter = require('@frctl/handlebars');
const React      = require('react');
const ReactDOM   = require('react-dom/server');
const Promise    = require('bluebird');
const Adapter    = require('@frctl/fractal').Adapter;

class ReactAdapter extends Adapter {

    constructor(source, loadPaths) {
        super(null, source);

        // Create a HandlebarsAdapter for rendering layouts
        this.hbsAdapter = HandlebarsAdapter({}).register(source, source._app);
    }

    render(path, str, context){
        delete require.cache[path];
        const component = require(path);
        const element   = React.createElement(component, context);
        const html      = ReactDOM.renderToStaticMarkup(element);
        return Promise.resolve(html);
    }

    renderLayout(path, str, context){
        return this.hbsAdapter.render(path, str, context);
    }

}

module.exports = function(config) {

    config = config || {}; // not doing anything with config right now!

    return {

        register(source, app) {
            return new ReactAdapter(source);
        }
    }

};
