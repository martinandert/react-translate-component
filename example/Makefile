BIN = ./node_modules/.bin

all: dev

lint:
	@$(BIN)/jsxhint client.js server.js

webpack-dev:
	@$(BIN)/webpack --debug --devtool inline-source-map --output-pathinfo

dev: webpack-dev
	@$(BIN)/node-dev --no-deps .

webpack-live:
	@NODE_ENV=production $(BIN)/webpack --optimize-occurence-order

live: webpack-live
	@NODE_ENV=production node .

.PHONY: lint webpack-dev dev webpack live
