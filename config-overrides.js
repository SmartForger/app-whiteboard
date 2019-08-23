module.exports = function override(config, env) {
  config.output = {
    path: config.output.path,
    filename: process.env.APPNAME ? `${process.env.APPNAME}.js` : "white-board-widget.js",
    publicPath: "",
    jsonpFunction: 'webpackJsonpReactWidgetBoilerplate',
    library: 'reactWidgetBoilerplate'  
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