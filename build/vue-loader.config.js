module.exports = {
    extractCSS: process.env.NODE_ENV === 'production',
    preserveWhitespace: false,
    postcss: [
        require('autoprefixer')({
            browsers: ['last 3 versions']
        })
    ],
    loaders: {
        css: require('extract-text-webpack-plugin').extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
        }),
        sass: require('extract-text-webpack-plugin').extract({
            fallback: 'vue-style-loader',
            loader: [{
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }]
        })
    }
}