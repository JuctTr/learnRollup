import type { Plugin } from "rollup";

import type {
    ResolvedAlias,
    ResolverFunction,
    ResolverObject,
    RollupAliasOptions
} from "../types";

function matches(pattern: string | RegExp, importee: string) {
    if (pattern instanceof RegExp) {
        return pattern.test(importee);
    }
    if (importee.length < pattern.length) {
        return false;
    }
    if (importee === pattern) {
        return true;
    }
    // eslint-disable-next-line prefer-template
    return importee.startsWith(pattern + "/");
}

function getEntries({
    entries,
    customResolver
}: RollupAliasOptions): readonly ResolvedAlias[] {
    if (!entries) {
        return [];
    }

    const resolverFunctionFromOptions = resolveCustomResolver(customResolver);

    if (Array.isArray(entries)) {
        return entries.map((entry) => {
            return {
                find: entry.find,
                replacement: entry.replacement,
                resolverFunction:
                    resolveCustomResolver(entry.customResolver) ||
                    resolverFunctionFromOptions
            };
        });
    }

    return Object.entries(entries).map(([key, value]) => {
        return {
            find: key,
            replacement: value,
            resolverFunction: resolverFunctionFromOptions
        };
    });
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getHookFunction<T extends Function>(
    hook: T | { handler?: T }
): T | null {
    if (typeof hook === "function") {
        return hook;
    }
    if (hook && "handler" in hook && typeof hook.handler === "function") {
        return hook.handler;
    }
    return null;
}

function resolveCustomResolver(
    customResolver: ResolverFunction | ResolverObject | null | undefined
): ResolverFunction | null {
    if (typeof customResolver === "function") {
        return customResolver;
    }
    if (customResolver) {
        return getHookFunction(customResolver.resolveId);
    }
    return null;
}

export default function alias(options: RollupAliasOptions = {}): Plugin {
    const entries = getEntries(options);

    if (entries.length === 0) {
        return {
            name: "alias",
            resolveId: () => null
        };
    }

    return {
        name: "alias",
        async buildStart(inputOptions) {
            await Promise.all(
                [
                    ...(Array.isArray(options.entries) ? options.entries : []),
                    options
                ].map(
                    ({ customResolver }) =>
                        customResolver &&
                        getHookFunction(customResolver.buildStart)?.call(
                            this,
                            inputOptions
                        )
                )
            );
        },
        /**
         * Async + First类型即 异步优先 的钩子
         * @param importee 当前模块路径
         * @param importer 引用当前模块的模块路径
         * @param resolveOptions 其余参数
         * @returns
         */
        resolveId(importee, importer, resolveOptions) {
            if (!importer) {
                return null;
            }
            // First match is supposed to be the correct one
            // 先检查能不能匹配别名规则
            const matchedEntry = entries.find((entry) =>
                matches(entry.find, importee)
            );
            // 如果不能匹配替换规则，或者当前模块是入口模块，则不会继续后面的别名替换流程
            if (!matchedEntry) {
                return null;
            }
            // 正式替换路径
            const updatedId = importee.replace(
                matchedEntry.find,
                matchedEntry.replacement
            );

            if (matchedEntry.resolverFunction) {
                return matchedEntry.resolverFunction.call(
                    this,
                    updatedId,
                    importer,
                    resolveOptions
                );
            }
            // 每个插件执行时都会绑定一个上下文对象作为 this
            // 这里的 this.resolve 会执行所有插件(除当前插件外)的 resolveId 钩子
            return this.resolve(
                updatedId,
                importer,
                Object.assign({ skipSelf: true }, resolveOptions)
            ).then((resolved) => resolved || { id: updatedId });
        }
    };
}
