import rule, { Options } from "../src/textlint-rule-pattern";
import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
const testOptions: Options = {
    patterns: [
        {
            message: "No todo",
            pattern: "/TODO:/i"
        },
        {
            message: "No todo in code",
            pattern: "/TODO \\[Issue #\\d+\\]:/i",
            forceCode: true
        },
        {
            message: "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
            pattern: "/(\\d{4})/(\\d{2})/(\\d{2})/i",
            replace: "$1-$2-$3",
            // special
            allows: ["/1000/01/01/"],
            allowNodeTypes: ["Link"]
        }
    ]
};
tester.run("textlint-rule-pattern", rule, {
    valid: [
        {
            text: "This is ok",
            options: testOptions
        },
        {
            text: "2000-01-01",
            options: testOptions
        },

        {
            text: "1000/01/01 is special, it will be ok",
            options: testOptions
        },
        {
            text: "[2000/01/01](https://example.com) is ignored, it is a link",
            options: testOptions
        }
    ],
    invalid: [
        {
            text: "TODO: it will be fixed",
            options: testOptions,
            errors: [
                {
                    message: "No todo",
                    range: [0, 5]
                }
            ]
        },
        {
            text: "[TODO: it will be fixed](https://example.com)",
            options: testOptions,
            errors: [
                {
                    message: "No todo",
                    index: 1
                }
            ]
        },
        // code
        {
            text: `
Next is Code Block.

    // TODO [Issue #1]: it will be fixed
    const test = "Test

`,
            options: testOptions,
            errors: [
                {
                    message: "No todo in code",
                    index: 29
                }
            ]
        },
        {
            text: "2000/01/01 is a date",
            options: testOptions,
            output: "2000-01-01 is a date",
            errors: [
                {
                    message: "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
                    index: 0
                }
            ]
        },
        // multi line
        {
            text: `\
- 2000/01/01
- 2001/01/01
- 2003/01/01
`,
            options: testOptions,
            output: `\
- 2000-01-01
- 2001-01-01
- 2003-01-01
`,
            errors: [
                {
                    message: "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
                    range: [2, 12]
                },
                {
                    message: "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
                    range: [15, 25]
                },
                {
                    message: "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
                    range: [28, 38]
                }
            ]
        }
    ]
});
