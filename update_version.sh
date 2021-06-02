#!/bin/bash
echo "Updating version with Github tags"

file="./src/pages/Dashboard/Layout/ContentFooter.vue"
if test -f "$file"; then
	commit=`git rev-parse --short HEAD`
	ver=`git log -1 --format=%cd --date=format:"%d.%m.%y"`
	full=$commit-$ver
	sed -i "s/version: .*$/version: '$full'/g" "$file"
	echo "File exists, replacing version with $full"
else
	echo "$file does not exist, no replacement done"
fi
