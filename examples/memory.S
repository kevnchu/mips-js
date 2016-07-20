.text

main:
    li $t0, 0x6655
    sh $t0, 0($gp)
    li $t0, 0x8877
    sh $t0, 2($gp)
    lb $t1, 0($gp)
    lb $t1, 1($gp)
    lb $t1, 2($gp)
    lb $t1, 3($gp)