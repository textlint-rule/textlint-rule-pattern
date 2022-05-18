# @textlint-rule/textlint-rule-pattern

A textlint rule that checks by RegExp patterns.

## Features

- Support User Defined Patterns
- Support RegExp patterns
- Support Replacement texts

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-rule/textlint-rule-pattern

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-rule/pattern": {
          "patterns": [
            {
              "message": "No todo",
              "pattern": "/TODO:/i"
            },
            {
              "message": "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
              "pattern": "/(\\d{4})/(\\d{2})/(\\d{2})/i",
              "replace": "$1-$2-$3",
              "allows": ["/1000/01/01/"],
              "allowNodeTypes": ["BlockQuote"]
            }
          ]
        }
    }
}
```

## Options

- **patterns**: an array of pattern object

```json5
{
    "rules": {
        "@textlint-rule/pattern": {
          "patterns": [
            /* Your rules is here! */
          ]
        }
    }
}
```

### Pattern

The pattern object has the following properties.

```ts
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
```

### RegExp-like String

This textlint rule use RegExp-like string for option value.
:memo: `g`(global) flag and `u`(unicode) is added by default.

| Input        | Ouput   | Note                                               |
|--------------|---------|----------------------------------------------------|
| `"str"`      | `/str/gu` | convert string to regexp with global               |
| `"/str/"`    | `/str/gu` |                                                    |
| `"/str/g"`   | `/str/gu` | Duplicated `g` is just ignored                     |
| `"/str/i"`   | `/str/igu` |                                                    |
| `"/str/u"`   | `/str/ug` |                                                    |
| `"/str/m"`   | `/str/mgu` |                                                    |
| `"/str/y"`   | `/str/ygu` |                                                    |
| ---          | ---     | ---                                                |
| `"/\\d+/"`   | `/\d+/gu` | You should escape meta character like `\d`         |
| `"/(\\d+)/"` | `/\d+/gu` | You can use capture. replace `$1` with the capture |

For more information, please see [textlint/regexp-string-matcher README](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

### Examples

If you want to found `TODO:` text, you can write following:

```json
{
    "rules": {
        "@textlint-rule/pattern": {
          "patterns": [
            {
              "message": "No todo",
              "pattern": "/TODO:/i"
            }
          ]
        }
    }
}
```

If you want to replace `YYYY/DD/MM` to `YYYY-DD-MM` format, you can write following:

e.g. `2000/01/01` will be `2000-01-01` by `textlint --fix`.

:memo: replace mark is starts with `$1`.

```json
{
    "rules": {
        "@textlint-rule/pattern": {
          "patterns": [
            {
              "message": "Must to use YYYY-MM-DD instead of YYYY/MM/DD",
              "pattern": "/(\\d{4})/(\\d{2})/(\\d{2})/i",
              "replace": "$1-$2-$3"
            }
          ]
        }
    }
}
```

If you want to check text in a CodeBlock, you need to enable `forceCode` flag. 

```json
{
    "rules": {
        "@textlint-rule/pattern": {
          "patterns": [
            {
              "message": "No todo in code",
              "pattern": "/TODO \\[Issue #\\d+\\]:/i",
              "forceCode": true
            }
          ]
        }
    }
}
```

## Changelog

See [Releases page](https://github.com/textlint-rule/textlint-rule-pattern/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-rule/textlint-rule-pattern/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
