        .data
str:
        .asciiz "the answer = "
        .text
        li $v0, 4               # system call code for print_str
        la $a0, str             # address of string to print
        syscall                 # print the string
        li $v0, 1               # system call code for print_int
        li $a0, 5               # integer to print
        syscall                 # print it