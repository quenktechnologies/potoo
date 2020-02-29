# Copy all the sources to the lib folder then run tsc.
lib: $(shell find src -type f)
	rm -R lib 2> /dev/null || true 
	mkdir lib
	cp -R -u src/* lib
	./node_modules/.bin/tsc --project lib

.PHONY: docs
docs: docs/api
	echo 'DO NOT DELETE!' > docs/.nojekyll 
	touch $@

.PHONY: docs/api
docs/api: src
	rm -R $@ || true
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--excludeExternals \
	--excludeNotExported \
	--excludePrivate \
	--tsconfig lib/tsconfig.json \
	--theme minimal 

