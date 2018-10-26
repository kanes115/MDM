#include <erl_nif.h>
#include <unistd.h>
#include <string.h>
// TODO
// * hold atoms in global env and only copy

static ERL_NIF_TERM
halo(ErlNifEnv *env, int argc, const ERL_NIF_TERM argv[]) {
  return enif_make_atom(env, "ok");
}

static void
send_session_id(pid_t session_id, int pipe_fd) {
  // TODO handle errors?
  write(pipe_fd, &session_id, sizeof(pid_t));
}

static char*
prepend_dot(char* path) {
// TODO memory leak fix
  char* tmp = malloc(512 * sizeof(char));//"./";
  strcpy(tmp, "./");
  strcat(tmp, path);
  return tmp;
}

static ERL_NIF_TERM
run_service(ErlNifEnv *env, int argc, const ERL_NIF_TERM argv[]) {
  char* service_dir = malloc(512 * sizeof(char));
  char* exec_path = malloc(256 * sizeof(char));

  if(enif_get_string(env, argv[0], service_dir, 256, ERL_NIF_LATIN1) < 1)
    return enif_make_badarg(env);
  if(enif_get_string(env, argv[1], exec_path, 256, ERL_NIF_LATIN1) < 1)
    return enif_make_badarg(env);

  chdir(service_dir);

  int pipefd[2];
  if (pipe(pipefd) == -1) {
    perror("pipe");
    return enif_make_atom(env, "error"); // TODO more verbose
  }

  exec_path = prepend_dot(exec_path);
  if(fork() == 0) {
    close(pipefd[0]); // close unused read end
    pid_t session_id = setsid();
    send_session_id(session_id, pipefd[1]);
    prepend_dot(exec_path);
    system(exec_path);
    close(pipefd[1]);
    exit(0);
  } else {
    close(pipefd[1]); // close unused write end
    pid_t session_id;
    read(pipefd[0], &session_id, sizeof(pid_t)); // integer will come in one batch
    return enif_make_tuple(env, 2, enif_make_atom(env, "ok"), enif_make_int(env, session_id));
  }
}

static ErlNifFunc
funcs[] = {
    {"halo", 0, halo, 0},
    {"run_service", 2, run_service, 0}
};

static int
load(ErlNifEnv *env, void **priv, ERL_NIF_TERM info) {
  return 0;
}




ERL_NIF_INIT(Elixir.MDMMinion.BackendNif, funcs, load, NULL, NULL, NULL)

