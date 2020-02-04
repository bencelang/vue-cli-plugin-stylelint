import { exec } from "child_process";
import StylelintWebpackPlugin from "stylelint-webpack-plugin";

let hasErrors = false;

type Options = {
  lintOnSave?: boolean;
  lintStyles?: boolean;
  pluginOptions?: {
    stylelint?: {
      files?: Array<string>;
    };
  };
};

function isActive(options: Options): boolean {
  return options.lintStyles !== undefined
    ? Boolean(options.lintStyles)
    : options.lintOnSave !== undefined
    ? Boolean(options.lintOnSave)
    : process.env.NODE_ENV === "production";
}

function resolveLoaderOptions(options: Options): any {
  return {
    files:
      options &&
      options.pluginOptions &&
      options.pluginOptions.stylelint &&
      options.pluginOptions.stylelint.files
        ? options.pluginOptions.stylelint.files
        : ["**/*.{vue,htm,html,css,sss,less,scss,sass}"]
  };
}

function say(text: string) {
  process.stdout.write(text);
}

function start(args: any, cmd: string) {
  if (args["no-fix"]) {
    args["no-fix"] = undefined;
    args["fix"] = true;
  }

  for (let arg in args) {
    // eslint-disable-next-line no-prototype-builtins
    if (args.hasOwnProperty(arg)) {
      if (args[arg] === "true") {
        cmd += ` --${arg}`;
      } else {
        cmd += ` --${arg}=${args[arg]}`;
      }
    }
  }

  exec(cmd, (error, stdout, stderr) => {
    say(stdout);
    if (error) {
      say("Error!");
      say(error.message);
      process.exit(1);
    }
    if (stderr) {
      say("Error!");
      say(stderr);
      hasErrors = true;
    }
    if ((!stderr || stderr === "") && !error && (!stdout || stdout === "")) {
      say("Found no style errors");
    }
  });
}

export function webpackConfig(config: any, options: Options) {
  if (isActive(options)) {
    config.plugin("stylelint").use(StylelintWebpackPlugin, [
      {
        ...resolveLoaderOptions(options)
      }
    ]);
  }

  return config;
}

export function run(options: Options, args: any) {
  hasErrors = false;

  if (!args) {
    args = {};
  }

  let cmd = "stylelint";

  if (!args.files) {
    resolveLoaderOptions(options).files.forEach(pattern => {
      cmd += ` ${pattern}`;
      start(args, cmd);
      cmd = "stylelint";
    });
  } else if (args.files.length) {
    cmd += ` "${args.files.join()}"`;
    args.files = undefined;
    start(args, cmd);
  }

  if (hasErrors) {
    process.exit(1);
  }

  process.exit(0);
}
