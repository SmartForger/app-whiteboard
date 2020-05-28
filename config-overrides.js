module.exports = function override(config, env) {
  const appName = process.env.APPNAME || 'react-widget-demo';
  const jsonpFunction = process.env.JSONP_FUNC || 'ukiJsonPReactWidgetDemo';
  const library = process.env.WEBPACK_LIBRARY || 'ukiLibReactWidgetDemo';

  config.output = {
    path: config.output.path,
    filename:  `${appName}.js`,
    publicPath: "",
    jsonpFunction,
    library
  };
  delete config.optimization.splitChunks;
  delete config.optimization.runtimeChunk;

  config.module.rules[2].oneOf.forEach(option => {
    if (
      option.test &&
      option.test.source &&
      option.test.source.indexOf("css") >= 0
    ) {
      option.use.splice(0, 1, { loader: "react-web-component-style-loader" });
    }
  });
  return config;
};