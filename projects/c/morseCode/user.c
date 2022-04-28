#include <stdlib.h>
#include <assert.h>
#include <string.h>
typedef short int16_t;

void clear() {
    system("clear");
}

struct userObj {
    const char * firstName;
    const char * lastName;
    int16_t age;
    float height;
};

static struct userObj * usersArray[4];
static struct userObj * userZero = NULL;
static struct userObj * userOne = NULL;
static struct userObj * userTwo = NULL;
static struct userObj * userThree = NULL;
int main(void) {

    char userInput[99];
    char selectMenu[1];

    
    userZero = malloc(sizeof(*userZero));
    assert(userZero != NULL);
    userZero->firstName = "user0";
    userZero->lastName = "Ipsum";
    userZero->age = 6;
    userZero->height = 1.3;
    userOne = malloc(sizeof(*userOne));
    assert(userOne != NULL);
    userOne->firstName = "user1";
    userOne->lastName = "Ipsum";
    userOne->age = 15;
    userOne->height = 1.5;
    userTwo = malloc(sizeof(*userTwo));
    assert(userTwo != NULL);
    userTwo->firstName = "user2";
    userTwo->lastName = "Ipsum";
    userTwo->age = 13;
    userTwo->height = 1.4;
    userThree = malloc(sizeof(*userThree));
    assert(userThree != NULL);
    userThree->firstName = "user3";
    userThree->lastName = "Ipsum";
    userThree->age = 14;
    userThree->height = 1.4;
    usersArray[0] = userZero;
    usersArray[1] = userOne;
    usersArray[2] = userTwo;
    usersArray[3] = userThree;

    clear();
    printf("height: %fm\n", usersArray[0]->height);
    printf("\n[ ]\n\Filter:\n [0]: By Age\n [1]: By Height\n [2]: By Firstname\n [3]: By Lastname\n\n");
    printf("[0/3] => ");
    scanf("%s", selectMenu);

    

   if (strcmp(selectMenu, "0") == 0) {
        clear();
        int is_found=-1, search_value;
    
        printf("\nAge => ");
        scanf("%d",&search_value);
        for(int i=0; i<4; i++){
            if(usersArray[i]->age == search_value){
                printf("\n\nItem found at index %d\n\n",i);

                printf("firstName: \"%s\"\n", usersArray[i]->firstName);
                printf("lastName: \"%s\"\n", usersArray[i]->lastName);
                printf("age: %d\n", usersArray[i]->age);
                printf("height: %.2fm\n", usersArray[i]->height);
                is_found=i;
            }
        }
    
    if(is_found==-1){
        printf("Item not found\n");
        main();
    }
   } else if (strcmp(selectMenu, "0") == 1) {
        clear();
        int is_found=-1;
        float search_value;
    
        printf("\nHeight => ");
        scanf("%f",&search_value);
        for(int i=0; i<4; i++){
            if(usersArray[i]->height == search_value){
                printf("\n\nItem found at index %d\n\n",i);

                printf("firstName: \"%s\"\n", usersArray[i]->firstName);
                printf("lastName: \"%s\"\n", usersArray[i]->lastName);
                printf("age: %d\n", usersArray[i]->age);
                printf("height: %.2fm\n", usersArray[i]->height);
                is_found=i;
            }
        }
    
    if(is_found==-1){
        printf("Item not found\n");
        main();
    }
    } else if (strcmp(selectMenu, "0") == 2) {
        clear();
        int is_found=-1;
        char search_value[99];
    
        printf("\nHeight => ");
        scanf("%s",&search_value);
        for(int i=0; i<4; i++){
            if(strcmp(search_value, usersArray[i]->firstName) == 0){
                printf("\n\nItem found at index %d\n\n",i);

                printf("firstName: \"%s\"\n", usersArray[i]->firstName);
                printf("lastName: \"%s\"\n", usersArray[i]->lastName);
                printf("age: %d\n", usersArray[i]->age);
                printf("height: %.2fm\n", usersArray[i]->height);
                is_found=i;
            }
        }
    
    if(is_found==-1){
        printf("Item not found\n");
        main();
    }
    } else if (strcmp(selectMenu, "0") == 3) {
        clear();
        int is_found=-1;
        char search_value[99];
    
        printf("\nHeight => ");
        scanf("%s",&search_value);
        for(int i=0; i<4; i++){
            if(strcmp(search_value, usersArray[i]->lastName) == 0){
                printf("\n\nItem found at index %d\n\n",i);

                printf("firstName: \"%s\"\n", usersArray[i]->firstName);
                printf("lastName: \"%s\"\n", usersArray[i]->lastName);
                printf("age: %d\n", usersArray[i]->age);
                printf("height: %.2fm\n", usersArray[i]->height);
                is_found=i;
            }
        }
    
    if(is_found==-1){
        printf("Item not found\n");
        main();
    }
    } else {main();}
    
    

    

    // free(userZero);
    // free(userOne);
    // free(userTwo);
    // free(userThree);

    return 0;
}
