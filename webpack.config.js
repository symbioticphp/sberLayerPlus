const path = require('path');


const config = {
    context: __dirname,
    entry: {
        sberLayer: [
            './src/sberLayer.js'
        ],
        sberLayerPlus: [
            './src/sberLayerPlus.js',

        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "var",
        library: "SberLayer",
       /* libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this',*/
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    }
};

module.exports = [
 {
    context: __dirname,
    entry: {
        sberLayer: [
            './src/sberLayer.js'
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "var",
        library: "SberLayer",
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    }
},
    {
        context: __dirname,
        entry: {
            sberLayerPlus: [
                './src/sberLayer.js',
                './src/sberLayerPlus.js',
            ],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: "var",
            library: "SberLayerPlus",
            /* libraryTarget: 'umd',
             umdNamedDefine: true,
             globalObject: 'this',*/
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
        }
    }

];