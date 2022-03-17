#include <stdlib.h> // sizeof keyword
#include <assert.h> // assert() function
#include <stdio.h>

typedef short int16_t;

struct morseCode_t {
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
struct numberObject {
    const char * code;
    int16_t key;
};

static struct morseCode_t * morseCode;
static struct numberObject * tmp_obj = NULL;
static struct numberObject * tmp_obj_2 = NULL;
static struct numberObject * tmp_obj_3 = NULL;
static struct numberObject * tmp_obj_4 = NULL;
static struct numberObject * tmp_obj_5 = NULL;
static struct numberObject * tmp_obj_6 = NULL;
static struct numberObject * tmp_obj_7 = NULL;
static struct numberObject * tmp_obj_8 = NULL;
static struct numberObject * tmp_obj_9 = NULL;
static struct numberObject * tmp_obj_10 = NULL;
int main(void) {
    tmp_obj = malloc(sizeof(*tmp_obj));
    assert(tmp_obj != NULL);
    tmp_obj->code = "-----";
    tmp_obj->key = 0;
    tmp_obj_2 = malloc(sizeof(*tmp_obj_2));
    assert(tmp_obj_2 != NULL);
    tmp_obj_2->code = ".----";
    tmp_obj_2->key = 1;
    tmp_obj_3 = malloc(sizeof(*tmp_obj_3));
    assert(tmp_obj_3 != NULL);
    tmp_obj_3->code = "..---";
    tmp_obj_3->key = 2;
    tmp_obj_4 = malloc(sizeof(*tmp_obj_4));
    assert(tmp_obj_4 != NULL);
    tmp_obj_4->code = "...--";
    tmp_obj_4->key = 3;
    tmp_obj_5 = malloc(sizeof(*tmp_obj_5));
    assert(tmp_obj_5 != NULL);
    tmp_obj_5->code = "....-";
    tmp_obj_5->key = 4;
    tmp_obj_6 = malloc(sizeof(*tmp_obj_6));
    assert(tmp_obj_6 != NULL);
    tmp_obj_6->code = ".....";
    tmp_obj_6->key = 5;
    tmp_obj_7 = malloc(sizeof(*tmp_obj_7));
    assert(tmp_obj_7 != NULL);
    tmp_obj_7->code = "-....";
    tmp_obj_7->key = 6;
    tmp_obj_8 = malloc(sizeof(*tmp_obj_8));
    assert(tmp_obj_8 != NULL);
    tmp_obj_8->code = "--...";
    tmp_obj_8->key = 7;
    tmp_obj_9 = malloc(sizeof(*tmp_obj_9));
    assert(tmp_obj_9 != NULL);
    tmp_obj_9->code = "---..";
    tmp_obj_9->key = 8;
    tmp_obj_10 = malloc(sizeof(*tmp_obj_10));
    assert(tmp_obj_10 != NULL);
    tmp_obj_10->code = "----.";
    tmp_obj_10->key = 9;
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
    morseCode->zero = tmp_obj;
    morseCode->one = tmp_obj_2;
    morseCode->two = tmp_obj_3;
    morseCode->three = tmp_obj_4;
    morseCode->four = tmp_obj_5;
    morseCode->five = tmp_obj_6;
    morseCode->six = tmp_obj_7;
    morseCode->seven = tmp_obj_8;
    morseCode->eight = tmp_obj_9;
    morseCode->nine = tmp_obj_10;
    printf("%s\n", morseCode->s);
    printf("%s\n", morseCode->six->code);
    free(morseCode);
    free(tmp_obj);
    free(tmp_obj_2);
    free(tmp_obj_3);
    free(tmp_obj_4);
    free(tmp_obj_5);
    free(tmp_obj_6);
    free(tmp_obj_7);
    free(tmp_obj_8);
    free(tmp_obj_9);
    free(tmp_obj_10);

    return 0;
}
