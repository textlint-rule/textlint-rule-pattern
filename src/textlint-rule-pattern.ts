import type { TextlintRuleReporter } from "@textlint/types";
import type { TxtNode } from "@textlint/ast-node-types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import { RuleHelper } from "textlint-rule-helper";

export type Pattern = {
    /**
     * This error message will be shown when match the pattern
     */
    message: string;
    /**
     * Match pattern string.
     * You can use RegExp-like string.
     * https://github.com/textlint/regexp-string-matcher#regexp-like-string
     */
    pattern: string;
    /**
     * Replace string
     * You can use capture pattern like $1, $2. ($0 will be ignored)
     */
    replace?: string;
    /**
     * An array of excludes pattern.
     * If the text is matched this pattern, suppress the error.
     * You can use RegExp-like string
     * https://github.com/textlint/regexp-string-matcher#regexp-like-string
     */
    allows?: string[];
    /**
     * An array for excludes node type.
     * If the text is in the node type, suppress the error.
     * https://github.com/textlint/textlint/blob/master/docs/txtnode.md#type
     * For example, if you want to ignore the text in block quote and link
     * "allowNodeTypes": ["Link", "BlockQuote"]
     */
    allowNodeTypes?: string[];

    /**
     * This rule ignore Code and CodeBlock by default.
     * If you want to check the code, please put this true
     */
    forceCode?: boolean;
};
export type Options = {
    patterns: Pattern[];
};
const replace = (text: string, captures: string[]) => {
    return text.replace(/\$([1-9])/g, (match, indexStr) => {
        const index = Number(indexStr);
        if (Number.isNaN(index)) {
            throw new Error(`Something wrong. ${indexStr} is NaN. `);
        }
        // if does not match capture, return original text
        // captures is align with [$1, $2, $3 ....]
        return captures[index - 1] ?? match;
    });
};
const report: TextlintRuleReporter<Options> = (context, options) => {
    const { Syntax, report, RuleError, fixer, getSource, locator } = context;
    const patterns = options?.patterns ?? [];
    const helper = new RuleHelper(context);
    const reportIfError = (node: TxtNode) => {
        const text = getSource(node);
        for (const pattern of patterns) {
            const isCodeNode = node.type === Syntax.Code || node.type === Syntax.CodeBlock;
            if (isCodeNode && !pattern.forceCode) {
                continue;
            }
            const results = matchPatterns(text, [pattern.pattern]);
            for (const result of results) {
                const index = result.startIndex || 0;
                const match = result.match || "";
                const allowedResults = pattern.allows ? matchPatterns(match, pattern.allows) : [];
                if (allowedResults.length > 0) {
                    continue; // suppress the error
                }
                const allowNodeTypes = pattern.allowNodeTypes ?? [];
                if (helper.isChildNode(node, allowNodeTypes)) {
                    return; // suppress the error
                }
                if (pattern.replace) {
                    const replaceText = replace(pattern.replace, result.captures);
                    report(
                        node,
                        new RuleError(pattern.message, {
                            padding: locator.range([index, index + match.length]),
                            fix: fixer.replaceTextRange([index, index + match.length], replaceText)
                        })
                    );
                } else {
                    report(
                        node,
                        new RuleError(pattern.message, {
                            padding: locator.range([index, index + match.length])
                        })
                    );
                }
            }
        }
    };
    return {
        [Syntax.Document](node) {
            if (patterns.length === 0) {
                report(
                    node,
                    new RuleError("You should set patterns at least one", {
                        index: 0
                    })
                );
            }
        },
        [Syntax.Str](node) {
            reportIfError(node);
        },
        [Syntax.Comment](node) {
            reportIfError(node);
        },
        [Syntax.Code](node) {
            reportIfError(node);
        },
        [Syntax.CodeBlock](node) {
            reportIfError(node);
        }
    };
};
export default {
    linter: report,
    fixer: report
};
