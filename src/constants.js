module.exports = {
  opcodeShift: 26,
  rsShift: 21,
  rtShift: 16,
  rdShift: 11,
  saShift: 6,
  funcShift: 0,

  rsMask: 0x1f,
  rtMask: 0x1f,
  rdMask: 0x1f,
  saMask: 0x1f,
  funcMask: 0x3f,
  cMask: 0xffff,
  addrMask: 0x3ffffff,

  opcodeBits: 6,
  rsBits: 5,
  rtBits: 5,
  rdBits: 5,
  saBits: 5,
  funcBits: 6
}
