#include <stdlib.h>
#include <string.h>
#include <stdio.h>

const char *tmp = "This string literal is arbitrary";

int main(int argc, char *argv[]){
    char *ret;

    ret = strstr(tmp, "name");
    if (ret)
        printf("found substring at address %p\n", ret);
    else
        printf("no substring found!\n");

    exit(EXIT_SUCCESS);
}