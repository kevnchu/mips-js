# compute the factorial of 9 using the following algorithm
#   N = 9
#   result = 1
#   while (N != 0) {
#     result = result * N
#     N = N - 1
#   }

.data                   # begin data section
msg:    .asciiz  "The factorial is: "   # message string

.text                           # begin program text
    .global __start
__start:
    addi    $sp, $sp, -4        # make some space on the stack
    addi    $t0, $0, 1              # $t0 will hold result, initially 1
    addi    $t1, $0, 9              # $t1 will hold N, initially 9
top:    beq $t1, $0, bottom
    mult    $t0, $t0, $t1           # result = result * N
    addi    $t1, $t1, -1            # decrement N
    j       top                     # goto top
bottom:
    sw      $t0, 0($sp)             # we'd better save result
    addi    $v0, $0, 4              # finished w/ loop, now print out
        addi    $a0, $gp, msg           # message, by invoking syscall 4
    syscall                         # (print_string)

        addi    $v0, $0, 1              # now print out result, by 
    lw      $a0, 0($sp)             # invoking syscall 1 (print_int)
        syscall

        addi    $sp, $sp, 4     # reset the stack
        addi    $v0, $0, 10     # exit syscall
        syscall
