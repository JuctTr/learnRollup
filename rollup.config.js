import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

// https://blog.indeex.club/index.php/2022/07/21/rollup%E6%90%AD%E5%BB%BA%E9%A1%B9%E7%9B%AE/

export default [
    // {
    //     input: "./src/demo/index.ts",
    //     output: {
    //         dir: "dist",
    //         format: "cjs",
    //         entryFileNames: "[name].cjs.js"
    //     },
    //     plugins: [resolve(), commonjs(), typescript()]
    // },
    // {
    //     input: "./src/index/index.ts",
    //     output: {
    //         dir: "dist",
    //         format: "esm",
    //         entryFileNames: "[name].esm.js"
    //     },
    //     plugins: [resolve(), commonjs(), typescript()]
    // },
    {
        input: "./src/main.tsx",
        output: {
            dir: "dist",
            format: "esm",
            entryFileNames: "[name].esm.js"
        },
        plugins: [
            typescript({
                sourceMap: true
            }),
            resolve(),
            commonjs()
        ]
    }
];
