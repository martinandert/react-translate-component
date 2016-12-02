BIN = ./node_modules/.bin

test: lint
	@$(BIN)/mocha -t 5000 -b -R spec spec.js

lint: node_modules/
	@$(BIN)/jsxhint index.js example/

node_modules/:
	@npm install

release-patch: test
	@$(call release,patch)

release-minor: test
	@$(call release,minor)

release-major: test
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish

define release
	npm version $(1) --message "Release v%s"
endef
