    .text
main:
    li  $t0, 0x0406
    # stores the least-significant 8-bit of a register (a byte) into: MEM[$s+C].
    sb  $t0, 0($sp)
    sb  $t0, 1($sp)
    sb  $t0, 4($sp)
