MIX = mix
CFLAGS += -g -O3 -ansi -pedantic -Wall -Wextra -Wno-unused-parameter

ERLANG_PATH = $(shell erl -eval 'io:format("~s", [lists:concat([code:root_dir(), "/erts-", erlang:system_info(version), "/include"])])' -s init stop -noshell)
CFLAGS += -I$(ERLANG_PATH)

# adjust these as your library desires
CFLAGS += -I/usr/local/include -I/usr/include -L/usr/local/lib -L/usr/lib
CFLAGS += -std=gnu99 -Wno-unused-function

ifneq ($(OS),Windows_NT)
	CFLAGS += -fPIC

	ifeq ($(shell uname),Darwin)
		LDFLAGS += -dynamiclib -undefined dynamic_lookup
	endif
endif

.PHONY: all clean

all: backend_nif

priv/backend_nif.so:
	$(CC) $(CFLAGS) -shared $(LDFLAGS) -o $@ c_src/backend_nif.c

clean:
	$(MIX) clean
	$(RM) priv/*
