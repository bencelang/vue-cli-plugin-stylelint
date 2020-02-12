"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var stylelint_webpack_plugin_1 = require("stylelint-webpack-plugin");
var hasErrors = false;
function isActive(options) {
    return options.lintStyles !== undefined
        ? Boolean(options.lintStyles)
        : options.lintOnSave !== undefined
            ? Boolean(options.lintOnSave)
            : process.env.NODE_ENV === "production";
}
function resolveLoaderOptions(options) {
    return {
        files: options &&
            options.pluginOptions &&
            options.pluginOptions.stylelint &&
            options.pluginOptions.stylelint.files
            ? options.pluginOptions.stylelint.files
            : ["**/*.{vue,htm,html,css,sss,less,scss,sass}"]
    };
}
function say(text) {
    process.stdout.write(text);
}
function start(args, cmd) {
    if (args["no-fix"]) {
        args["no-fix"] = undefined;
        args["fix"] = true;
    }
    for (var arg in args) {
        if (args.hasOwnProperty(arg)) {
            if (args[arg] === "true") {
                cmd += " --" + arg;
            }
            else {
                cmd += " --" + arg + "=" + args[arg];
            }
        }
    }
    child_process_1.exec(cmd, function (error, stdout, stderr) {
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
function webpackConfig(config, options) {
    if (isActive(options)) {
        config.plugin("stylelint").use(stylelint_webpack_plugin_1.default, [
            __assign({}, resolveLoaderOptions(options))
        ]);
    }
    return config;
}
exports.webpackConfig = webpackConfig;
function run(options, args) {
    hasErrors = false;
    if (!args) {
        args = {};
    }
    var cmd = "stylelint";
    if (!args.files) {
        resolveLoaderOptions(options).files.forEach(function (pattern) {
            cmd += " " + pattern;
            start(args, cmd);
            cmd = "stylelint";
        });
    }
    else if (args.files.length) {
        cmd += " \"" + args.files.join() + "\"";
        args.files = undefined;
        start(args, cmd);
    }
    if (hasErrors) {
        process.exit(1);
    }
    process.exit(0);
}
exports.run = run;
