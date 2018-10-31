#include <erl_nif.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
// TODO
// * hold atoms in global env and only copy

static int
send_session_id(pid_t session_id, int pipe_fd) {
  return write(pipe_fd, &session_id, sizeof(pid_t));
}

static char*
prepend_dot(char* path) {
// TODO memory leak fix
  char* tmp = malloc(512 * sizeof(char));
  strcpy(tmp, "./");
  strcat(tmp, path);
  return tmp;
}

static char*
append_redirection(char* cmd) {
  char* tmp = malloc(516 * sizeof(char));
  strcpy(tmp, " 2>&1");
  strcat(cmd, tmp);
  return cmd;
}

static ERL_NIF_TERM
make_error(ErlNifEnv* env, char* reason) {
    return enif_make_tuple(env, 2, enif_make_atom(env, "error"), enif_make_atom(env, reason));
}

static void
run_cmd(char* path, char* log_file_path) {
  FILE* log_file = fopen(log_file_path, "w");
  FILE* fp;
  char output[1035];
  fp = popen(path, "r");
  if (fp == NULL) {
    printf("Failed to run command\n" );
    exit(1);
  }

  while (fgets(output, sizeof(output)-1, fp) != NULL) {
    fprintf(log_file, "%s", output);
  }
  pclose(fp);
}

static ERL_NIF_TERM
run_service(ErlNifEnv *env, int argc, const ERL_NIF_TERM argv[]) {
  char* service_dir = malloc(512 * sizeof(char));
  char* exec_path = malloc(256 * sizeof(char));
  char* log_file_path = malloc(256 * sizeof(char));

  if(enif_get_string(env, argv[0], service_dir, 256, ERL_NIF_LATIN1) < 1)
    return enif_make_badarg(env);
  if(enif_get_string(env, argv[1], exec_path, 256, ERL_NIF_LATIN1) < 1)
    return enif_make_badarg(env);
  if(enif_get_string(env, argv[2], log_file_path, 256, ERL_NIF_LATIN1) < 1)
    return enif_make_badarg(env);

  // TODO check if whole beam changes chdir after nif call is finished
  if(chdir(service_dir) == -1)
    return make_error(env, "service_dir_does_not_exist");

  if(access(exec_path, F_OK) == -1)
    return make_error(env, "exec_file_does_not_exist");

  int pipefd[2];
  if (pipe(pipefd) == -1) {
    perror("pipe");
    return make_error(env, "forking_failed");
  }

  exec_path = prepend_dot(exec_path);
  exec_path = append_redirection(exec_path);
  if(fork() == 0) {
    close(pipefd[0]); // close unused read end
    pid_t session_id = setsid();
    if(send_session_id(session_id, pipefd[1]) == -1)
      return make_error(env, "forking_failed");
    prepend_dot(exec_path);
    // this will block or not but we don't care as long as the script under exec_path doesn't use setsid
    run_cmd(exec_path, log_file_path);
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
    {"run_service", 3, run_service, 0}
};

static int
load(ErlNifEnv *env, void **priv, ERL_NIF_TERM info) {
  return 0;
}




ERL_NIF_INIT(Elixir.MDMMinion.BackendNif, funcs, load, NULL, NULL, NULL)

