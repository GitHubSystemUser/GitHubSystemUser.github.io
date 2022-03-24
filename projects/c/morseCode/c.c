#include <stdlib.h> // sizeof kzeyword
#include <string.h>
#include <assert.h> // assert() function
#include <stdio.h>
#include <time.h>


typedef short int16_t; // indicates a 16-bit signed integer type

char userInput[];
char selectMenu[];

void clear() {
    system("clear");
}

int intToAscii(int number) {
   return '0' + number;
}


// Define struct
struct morseCodeStruct {
    const char * a;
    const char * b;
    const char * c;
    const char * d;
    const char * e;
    const char * f;
    const char * g;
    const char * h;
    const char * i;
    const char * j;
    const char * k;
    const char * l;
    const char * m;
    const char * n;
    const char * o;
    const char * p;
    const char * q;
    const char * r;
    const char * s;
    const char * t;
    const char * u;
    const char * v;
    const char * w;
    const char * x;
    const char * y;
    const char * z;

    struct numberObject * zero;
    struct numberObject * one;
    struct numberObject * two;
    struct numberObject * three;
    struct numberObject * four;
    struct numberObject * five;
    struct numberObject * six;
    struct numberObject * seven;
    struct numberObject * eight;
    struct numberObject * nine;
};

// Define numberObject structure 
struct numberObject {
    const char * code;
    int16_t value;
};

static struct morseCodeStruct * morseCode;

static struct numberObject * numObjZero = NULL;
static struct numberObject * numObjOne = NULL;
static struct numberObject * numObjTwo = NULL;
static struct numberObject * numObjThree = NULL;
static struct numberObject * numObjFour = NULL;
static struct numberObject * numObjFive = NULL;
static struct numberObject * numObjSix = NULL;
static struct numberObject * numObjSeven = NULL;
static struct numberObject * numObjEight = NULL;
static struct numberObject * numObjNine = NULL;

int main(void) {
    numObjZero = malloc(sizeof(*numObjZero));
    assert(numObjZero != NULL);
    numObjZero->code = "-----";
    numObjZero->value = 0;

    numObjOne = malloc(sizeof(*numObjOne));
    assert(numObjOne != NULL);
    numObjOne->code = ".----";
    numObjOne->value = 1;

    numObjTwo = malloc(sizeof(*numObjTwo));
    assert(numObjTwo != NULL);
    numObjTwo->code = "..---";
    numObjTwo->value = 2;

    numObjThree = malloc(sizeof(*numObjThree));
    assert(numObjThree != NULL);
    numObjThree->code = "...--";
    numObjThree->value = 3;

    numObjFive = malloc(sizeof(*numObjFive));
    assert(numObjFive != NULL);
    numObjFive->code = "....-";
    numObjFive->value = 4;

    numObjFive = malloc(sizeof(*numObjFive));
    assert(numObjFive != NULL);
    numObjFive->code = ".....";
    numObjFive->value = 5;

    numObjSix = malloc(sizeof(*numObjSix));
    assert(numObjSix != NULL);
    numObjSix->code = "-....";
    numObjSix->value = 6;

    numObjSeven = malloc(sizeof(*numObjSeven));
    assert(numObjSeven != NULL);
    numObjSeven->code = "--...";
    numObjSeven->value = 7;

    numObjEight = malloc(sizeof(*numObjEight));
    assert(numObjEight != NULL);
    numObjEight->code = "---..";
    numObjEight->value = 8;

    numObjNine = malloc(sizeof(*numObjNine));
    assert(numObjNine != NULL);
    numObjNine->code = "----.";
    numObjNine->value = 9;

    morseCode = malloc(sizeof(*morseCode));
    assert(morseCode != NULL);

    morseCode->a = ".-";
    morseCode->b = "-...";
    morseCode->c = "-.-.";
    morseCode->d = "-..";
    morseCode->e = ".";
    morseCode->f = "..-.";
    morseCode->g = "--.";
    morseCode->h = "....";
    morseCode->i = "..";
    morseCode->j = ".---";
    morseCode->k = "-.-";
    morseCode->l = ".-..";
    morseCode->m = "--";
    morseCode->n = "-.";
    morseCode->o = "---";
    morseCode->p = ".--.";
    morseCode->q = "--.-";
    morseCode->r = ".-.";
    morseCode->s = "...";
    morseCode->t = "-";
    morseCode->u = "..-";
    morseCode->v = "...-";
    morseCode->w = ".--";
    morseCode->x = "-..-";
    morseCode->y = "-.--";
    morseCode->z = "--..";
    morseCode->zero = numObjZero;
    morseCode->one = numObjOne;
    morseCode->two = numObjTwo;
    morseCode->three = numObjThree;
    morseCode->four = numObjFive;
    morseCode->five = numObjFive;
    morseCode->six = numObjSix;
    morseCode->seven = numObjSeven;
    morseCode->eight = numObjEight;
    morseCode->nine = numObjNine;


    //printf("%s\n", morseCode->s);
    //printf("%s\n", morseCode->six->code);
    clear();
    //printf("The quick brown fox jumps over the lazy dog\n\n");

    printf("[ ]\n\nSelect:\n [0]: MorseCode\n [1]: Binaire\n [2]: Hexadecimal\n [3]: Password Generator\n\n");
    printf("[0/3] => ");
    scanf("%s", selectMenu);

   if (strcmp(selectMenu, "0") == 0) {
        clear();

        printf("[MorseCode]\n\nSelect:\n [0]: String to MorseCode\n [1]: MorseCode to String\n\n");
        printf("[0/1] => ");
        scanf("%s", selectMenu);
       
        if (strcmp(selectMenu, "0") == 0) {
            clear();
            printf("[MorseCode > String to MorseCode]\n\n");
            printf("\n=> ");
        scanf("%s", userInput);

        size_t length = strlen(userInput);
        size_t i = 0; 
        for (; i < length; i++) {
            printf("%c\n", userInput[i]);
            if(strcmp(&userInput[i], "i") == 0)
                printf("%s\n", morseCode->a);
        }
       }
       if (strcmp(selectMenu, "1") == 0) {
            clear();
            printf("[MorseCode > MorseCode to String]\n\n");
            printf("\n=> ");
            scanf("%s", userInput);
            clear();
       }
   } else if (strcmp(selectMenu, "1") == 0) {
        clear();
        printf("[Binaire]\n\n");
        printf("\n=> ");
   } else if (strcmp(selectMenu, "2") == 0) {
        clear();
        printf("[HEX]\n\n");
        printf("\n=> ");
   } else if (strcmp(selectMenu, "3") == 0) {
        clear();
        printf("[PW]\n\n");
        srand(time(NULL));
        char password[];

        char test = random;
        // int random = rand();
        //printf("%c %d", testInt, testInt);
       for(int i = 0; i <= 15; i++) {
           int upperCaseInt = (rand() % (90 - 65 + 1)) + 65;
           int lowerCaseInt = (rand() % (122 - 97 + 1)) + 97;
           printf("UpperCase: %c %d\n", upperCaseInt, upperCaseInt);
           printf("LowerCase: %c %d\n", lowerCaseInt, lowerCaseInt);
       }
   } else {
       main();
   }



    // printf("\n%s\n", userInput);

    //size_t i = 0;
    //while (userInput[i] != '\0') {       /* Stop looping when we reach the null-character. */
    //    printf("%c\n", userInput[i]);
    //    i++;
    //}





    // deallocates the memory previously allocated
    /*
    free(morseCode);
    free(numObjZero);
    free(numObjOne);
    free(numObjTwo);
    free(numObjThree);
    free(numObjFour);
    free(numObjFive);
    free(numObjSix);
    free(numObjSeven);
    free(numObjEight);
    free(numObjNine);
    */

    return 0;
}