BIN = ./node_modules/.bin

all: dev

lint:
	@$(BIN)/jsxhint client.js server.js

webpack-dev:
	@$(BIN)/webpack --debug --devtool inline-source-map --output-pathinfo

dev: webpack-dev
	@$(BIN)/node-dev --no-deps server.js

webpack:
	@NODE_ENV=production $(BIN)/webpack --optimize-occurence-order

live: webpack
	@NODE_ENV=production node server.js

.PHONY: lint webpack-dev dev webpack live
