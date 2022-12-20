/**
 * 参考文档：https://cloud.tencent.com/developer/article/1840432
 */
module.exports = {
    env: {
        /**
         * "writable"或者 true，表示变量可重写；
         * "readonly"或者false，表示变量不可重写；
         * "off"，表示禁用该全局变量。
         */
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
        // 1. 接入 prettier 的规则
        // "prettier",
        // "plugin:prettier/recommended"
    ],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
    },
    // plugins: ["react", "@typescript-eslint", "prettier"],
    plugins: ["react", "@typescript-eslint"],
    rules: {
        // 3. 注意要加上这一句，开启 prettier 自动修复的功能
        // "prettier/prettier": "error",
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "react/react-in-jsx-scope": "off"
    }
};
