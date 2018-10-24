#include <erl_nif.h>

static ERL_NIF_TERM
halo(ErlNifEnv *env, int argc, const ERL_NIF_TERM argv[]) {
  return enif_make_atom(env, "ok");
}

static ErlNifFunc
funcs[] = {
    {"halo", 0, halo}
};

static int
load(ErlNifEnv *env, void **priv, ERL_NIF_TERM info) {
  return 0;
}

ERL_NIF_INIT(Elixir.MDMMinion.BackendNif, funcs, load, NULL, NULL, NULL)

