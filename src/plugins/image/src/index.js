/* eslint-disable */
// @ts-nocheck
import { readFileSync } from "fs";
import { extname } from "path";

import { createFilter } from "@rollup/pluginutils";
import svgToMiniDataURI from "mini-svg-data-uri";

const defaults = {
    dom: false,
    exclude: null,
    include: null
};

const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
};

const domTemplate = ({ dataUri }) => `
  var img = new Image();
  img.src = "${dataUri}";
  export default img;
`;

const constTemplate = ({ dataUri }) => `
  var img = "${dataUri}";
  export default img;
`;

const getDataUri = ({ format, isSvg, mime, source }) =>
    isSvg ? svgToMiniDataURI(source) : `data:${mime};${format},${source}`;

export default function image(opts = {}) {
    const options = Object.assign({}, defaults, opts);
    const filter = createFilter(options.include, options.exclude);

    return {
        name: "image",
        /**
         * Async + First类型，即异步优先的钩子
         * 通过 resolveId 解析后的路径来加载模块内容。
         * @param {*} id
         * @returns
         */
        load(id) {
            if (!filter(id)) {
                return null;
            }
            // 判断扩展名，如果不是图片类型，返回 null，交给下一个插件处理
            const mime = mimeTypes[extname(id)];
            if (!mime) {
                // not an image
                return null; // 交给下一个插件处理
            }

            const isSvg = mime === mimeTypes[".svg"];
            const format = isSvg ? "utf-8" : "base64";
            const source = readFileSync(id, format).replace(/[\r\n]+/gm, "");
            const dataUri = getDataUri({ format, isSvg, mime, source });
            const code = options.dom
                ? domTemplate({ dataUri })
                : constTemplate({ dataUri });
            // 返回值为 string 或者对象，则终止后续插件的处理
            return code.trim();
        }
    };
}
