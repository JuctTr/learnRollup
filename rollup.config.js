import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
/**
 * rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式import/export。
 * 然而大量的npm模块是基于CommonJS模块方式，这就导致了大量 npm模块不能直接编译使用。
 */
import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import serve from "rollup-plugin-serve";
import replace from "@rollup/plugin-replace";

/**
 * 常用的命令：
 * -f。-f参数是--format的缩写，它表示生成代码的格式，amd表示采用AMD标准，cjs为CommonJS标准，esm（或 es）为ES模块标准。-f的值可以为amd、cjs、system、esm（'es’也可以）、iife或umd中的任何一个。
 * -o。-o指定了输出的路径，这里我们将打包后的文件输出到dist目录下的bundle.js
 * -c。指定rollup的配置文件。
 * -w。监听源文件是否有改动，如果有改动，重新打包
 */

// https://blog.indeex.club/index.php/2022/07/21/rollup%E6%90%AD%E5%BB%BA%E9%A1%B9%E7%9B%AE/

// 开发组件库 https://blog.harveydelaney.com/creating-your-own-react-component-library/

// https://www.jordinebot.me/posts/react-typescript-web-rollup-project-from-scratch/

// 【一文带你快速上手Rollup】：

// https://juejin.cn/post/6869551115420041229

export default [
    {
        input: "./src/main.tsx",
        output: {
            dir: "dist",
            format: "umd",
            entryFileNames: "[name].umd.js",
            sourcemap: true,
            globals: {
                react: "React",
                "react-dom/client": "ReactDOM"
            }
        },
        // eslint-disable-next-line no-sparse-arrays
        plugins: [
            replace({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                preventAssignment: true
            }),
            ,
            typescript({
                sourceMap: true
            }),
            resolve(),
            commonjs(),
            html({
                title: "Rollup + React + TS",
                meta: [
                    {
                        charset: "utf-8"
                    },
                    {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0"
                    }
                ],
                fileName: "index.html",
                template: (args) => {
                    console.log(args.attributes);
                    console.log(args.meta);
                    console.log(args.title);
                    return `
                    <!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                <title>${args.title}</title>
                            </head>
                            <body>
                                <div id="root"></div>
                                <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
                                <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
                                <script type="module" src="main.umd.js"></script>
                            </body>
                        </html>
                        `;
                }
            }),
            process.env.NODE_ENV === "development" && serve("dist")
        ],
        external: ["react", "react-dom/client"]
    }
];
