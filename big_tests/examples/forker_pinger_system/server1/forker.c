#include <unistd.h>

int main(int argc, char** argv) {

  if(fork() == 0) {
    if(fork() == 0) {
      while(1) {printf("printing hejoooo");}
    }
    while(1) {}
  }

}
