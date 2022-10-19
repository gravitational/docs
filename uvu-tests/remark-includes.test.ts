import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { readFileSync } from "fs";
import { resolve } from "path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkGFM from "remark-gfm";
import remarkIncludes, {
  ParameterAssignments,
  RemarkIncludesOptions,
  parsePartialParams,
  resolveParamValue,
} from "../server/remark-includes";

const transformer = (
  vfileOptions: VFileOptions,
  pluginOptions: RemarkIncludesOptions = { resolve: true }
) => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkGFM)
    .use(remarkIncludes, {
      rootDir: "server/fixtures/includes/",
      ...pluginOptions,
    })
    .processSync(file);
};

const Suite = suite("server/remark-includes");

Suite("Fixture match result on resolve", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-source.mdx"),
    "utf-8"
  );

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  }).toString();

  const expected = readFileSync(
    resolve("server/fixtures/includes-result.mdx"),
    "utf-8"
  );

  assert.equal(result, expected);
});

Suite("Returns correct warnings on lint", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-source.mdx"),
    "utf-8"
  );

  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    { lint: true, resolve: false }
  );

  const errors = result.messages.map(({ message }) => message);

  const expectedErrors = [
    "Includes only works if they are the only content on the line",
    "Wrong import path non-existing.mdx in file /content/4.0/docs/pages/filename.mdx.",
  ];

  assert.equal(errors, expectedErrors);
});

Suite("Leave includes in place on { resolve: false }", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-source.mdx"),
    "utf-8"
  );

  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    { lint: false, resolve: false }
  ).toString();

  assert.equal(value, result);
});

Suite("Multiple includes resolve in code block", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-multiple-source.mdx"),
    "utf-8"
  );

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  }).toString();

  const expected = readFileSync(
    resolve("server/fixtures/includes-multiple-result.mdx"),
    "utf-8"
  );

  assert.equal(result, expected);
});

Suite("resolveParamValue handles quotes correctly in parameter values", () => {
  interface testCase {
    description: string;
    input: string;
    shouldThrow: boolean;
    expected?: string;
  }
  const cases: testCase[] = [
    {
      description: "mismatched quotes",
      input: `"This is a string'`,
      shouldThrow: true,
    },
    {
      description: "double quotes containing single quotes",
      input: `"This is a 'string'"`,
      shouldThrow: false,
      expected: `This is a 'string'`,
    },
    {
      description: "single quotes containing double quotes",
      input: `'This is a "string"'`,
      shouldThrow: false,
      expected: `This is a "string"`,
    },
    {
      description: "single quotes containing escaped single quotes",
      input: `'This is a \\'string\\''`,
      shouldThrow: false,
      expected: `This is a \\'string\\'`,
    },
    {
      description: "double quotes containing escaped double quotes",
      input: `"This is a \\"string\\""`,
      shouldThrow: false,
      expected: `This is a "string"`,
    },
    {
      description: "input not wrapped in quotes",
      input: `This is a string`,
      shouldThrow: true,
    },
    {
      description: "empty input",
      input: ``,
      shouldThrow: true,
    },
  ];

  cases.forEach((c) => {
    if (c.shouldThrow == true) {
      assert.throws(
        () => {
          resolveParamValue(c.input);
        },
        undefined,
        new Error(
          `${c.description}: expected resolveParamValue to throw, but it did not`
        )
      );
      return;
    }
    if (!c.expected) {
      return;
    }
    const val = resolveParamValue(c.input);
    assert.equal(
      c.expected,
      val,
      new Error(
        `${c.description}: expected a resolved parameter value of:\n${c.expected}\n...but got:\n${val}`
      )
    );
  });
});

Suite("parsePartialParams correctly parses parameter assignments", () => {
  interface testCase {
    description: string;
    shouldThrow: boolean;
    input: string;
    expected?: ParameterAssignments;
  }

  const cases: testCase[] = [
    {
      description: "straightforward case",
      shouldThrow: false,
      input: `(!includes/example.mdx var1="this is a value" var2='this is also a value'!)`,
      expected: {
        var1: `"this is a value"`,
        var2: `'this is also a value'`,
      },
    },
    {
      description: "no parameters",
      shouldThrow: false,
      input: "(!includes/example.mdx!)",
      expected: {},
    },
    {
      description: "mismatched quotes within matching quotes",
      shouldThrow: false,
      input: `(!includes/example.mdx var1="this is a value' var2='this is also a value"!)`,
      expected: {
        var1: `"this is a value' var2='this is also a value"`,
      },
    },
    {
      description: "mismatched quotes, alternating",
      input: `(!includes/example.mdx var1="this is a value' var2="this is also a value'!)`,
      shouldThrow: true,
    },
    {
      description: "escaped quotes",
      shouldThrow: false,
      input: `(!includes/example.mdx var1="this is a \\"quote\\"" var2='this is a \\'quote\\''!)`,
      expected: {
        var1: `"this is a \\"quote\\""`,
        var2: `'this is a \\'quote\\''`,
      },
    },
    {
      description: "end of input before second quote",
      shouldThrow: true,
      input: `(!includes/example.mdx var1="this is a value" var2="this is also a value!)`,
    },
    {
      description: "quoted value with no key",
      shouldThrow: true,
      input: `(!includes/example.mdx "this is a value" "this is also a value" var1="another value"!)`,
    },
    {
      description: "not an inclusion expression",
      shouldThrow: true,
      input: "example.mdx",
    },
    {
      description: "exclamation point",
      shouldThrow: false,
      input: `(!error-message.mdx message="Installation has failed!"!)`,
      expected: {
        message: `"Installation has failed!"`,
      },
    },
    {
      description: "escaped quotes",
      shouldThrow: false,
      input: `(!error-message.mdx message="Type \\"final\\" to see the final screen."!)`,
      expected: {
        message: `"Type \\"final\\" to see the final screen."`,
      },
    },
  ];

  cases.forEach((c) => {
    if (c.shouldThrow == true) {
      assert.throws(
        () => {
          parsePartialParams(c.input);
        },
        undefined,
        new Error(
          `${c.description}: expected parsePartialParams to throw, but it did not`
        )
      );
      return;
    }
    if (!c.expected) {
      return;
    }
    const val = parsePartialParams(c.input);
    assert.equal(
      c.expected,
      val,
      new Error(
        `${c.description}: expected parsed partial params:\n${JSON.stringify(
          c.expected
        )}\n...but got:\n${JSON.stringify(val)}`
      )
    );
  });
});

Suite("Resolves template variables in includes", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-vars.mdx"),
    "utf-8"
  );

  const expected = readFileSync(
    resolve("server/fixtures/includes-vars-result.mdx"),
    "utf-8"
  );

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  }).toString();

  assert.equal(result, expected);
});

Suite.run();
