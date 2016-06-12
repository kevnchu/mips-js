	.data
value:  .word 15
	.text

main:
    li $t2, 0x19		# Load immediate value (25) 
    lw $t3, value	# Load the word stored at label 'value'
    add $t4, $t2, $t3	# Add
    sub $t5, $t2, $t3	# Subtract
    li      $v0, 10              # terminate program run and
    syscall 
