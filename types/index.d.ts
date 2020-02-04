declare type Options = {
    lintOnSave?: boolean;
    lintStyles?: boolean;
    pluginOptions?: {
        stylelint?: {
            files?: Array<string>;
        };
    };
};
export declare function webpackConfig(config: any, options: Options): any;
export declare function run(options: Options, args: any): void;
export {};
//# sourceMappingURL=index.d.ts.map