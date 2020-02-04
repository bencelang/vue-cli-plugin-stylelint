const { webpackConfig, run } = require("./dist");

module.exports = (api, options) => {
  api.chainWebpack(cfg => {
    return (config = cfg) => webpackConfig(config, options);
  });

  api.registerCommand(
    "stylelint",
    {
      description: "lint and fix source styles",
      usage: "vue-cli-service stylelint [options] [...files]",
      options: { "--no-fix": "do not fix errors" }
    },
    args => {
      run(args, options);
    }
  );
};
