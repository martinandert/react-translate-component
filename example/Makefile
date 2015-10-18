BIN = ./node_modules/.bin

all: dev

lint:
	@$(BIN)/jsxhint client.js server.js

webpack-dev:
	@$(BIN)/webpack --debug --devtool inline-source-map --output-pathinfo

dev: webpack-dev
	@$(BIN)/node-dev .

webpack-live:
	@NODE_ENV=production $(BIN)/webpack --optimize-occurence-order

live: webpack-live
	@NODE_ENV=production node .

publish:
	cap production deploy deploy:restart

.PHONY: lint webpack-dev dev webpack-live live publish
