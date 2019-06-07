if [[ -n $(git status --porcelain) ]]; then echo "repo is not checked in fully. Try again."; exit 1; fi

grunt

echo "<h2>Deployed " `date` "</h2>" >> index.html

echo "<h3>" `git log -1` "</h3>" >> index.html
git add -f dist/* index.html

git commit -m "Releasing"
echo "Pushing to gh-pages"
git push -f origin `git rev-parse --symbolic-full-name --abbrev-ref HEAD`:gh-pages
echo "Going backward one revision"
git reset --hard HEAD~1

echo "https://caryfitzhugh.github.io/ma-ccc-web/"
