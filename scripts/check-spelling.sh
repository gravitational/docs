# $1 is the content directory in which to check spelling. A content directory is
# a git submodule pointing to a branch of the gravitational/teleport repository.

if [ $# -eq 0 ]; then

    cat<<EOF

You must provide an argument to the spellcheck script. The argument must be the
path to a content directory, which is either:

- A subdirectory of "content" within a gravitational/docs clone
- The root of a gravitational/teleport clone

EOF
exit 1;
fi

if [ ! -e $1/docs/cspell.json ]; then

    cat<<EOF

We could not find $1/docs/cspell.json. Make sure you run the spellcheck script
on either:

- A subdirectory of "content" within a gravitational/docs clone
- The root of a gravitational/teleport clone

EOF
exit 1;
fi

npx cspell lint --no-progress --config $1/docs/cspell.json "$1/docs/pages/**/*.mdx" "$1/CHANGELOG.md";
RES=$?;
if [ $RES -ne 0 ]; then
  cat<<EOF

There are spelling issues in one or more pages within $1/docs/pages (see the
logs above). Either fix the misspellings or, if these are not actually issues,
edit the list of ignored words in $1/docs/cspell.json.

EOF
exit $RES;
fi

