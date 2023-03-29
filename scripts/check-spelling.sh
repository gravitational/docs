# $1 is the content directory in which to check spelling. A content directory is
# a git submodule pointing to a branch of the gravitational/teleport repository.

npx cspell lint --no-progress --config $1/docs/cspell.json $1/docs/pages/**/*.mdx;
if [ $? -ne 0 ]; then
  cat<<EOF

There are spelling issues in one or more pages within $1/docs/pages (see the
logs above). Either fix the misspellings or, if these are not actually issues,
edit the list of ignored words in $1/docs/cspell.json.

EOF
fi

