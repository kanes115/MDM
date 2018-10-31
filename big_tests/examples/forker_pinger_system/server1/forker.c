#include <unistd.h>
#include <time.h>
#include <stdlib.h>

int main(int argc, char** argv) {
  
  srand(time(NULL));

  if(fork() == 0) {
    char* big_space = (char*) malloc(525000000);

    for(int i = 0; i < 525000000; i++)
      *(big_space+i) = 'a';

    while(1) {
    }
  }

}
