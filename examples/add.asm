main:
    li $t2, 25		# Load immediate value (25) 
    lw $t3, value		# Load the word stored at label 'value'
    add $t4, $t2, $t3	# Add
    sub $t5, $t2, $t3	# Subtract