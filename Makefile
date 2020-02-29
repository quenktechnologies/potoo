# Copy all the sources to the lib folder then run tsc.
lib: $(shell find src -type f)
	rm -R lib 2> /dev/null || true 
	mkdir lib
	cp -R -u src/* lib
	./node_modules/.bin/tsc --project lib

.PHONY:
public: public/api
	echo 'DO NOT DELETE!' > public/api/.nojekyll 
	touch $@

# Generate typedoc documentation.
public/api: src
	rm -R $@ || true
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--excludeExternals \
	--excludeNotExported \
	--excludePrivate \
	--tsconfig lib/tsconfig.json \
	--theme minimal 

