const r = require('prttty').render
const JSONSign = require('./main.js')

// create sekrit/public pair
const kp = JSONSign.keypair()

console.log(`keypair=${r(kp)}`)

// like whatever,
const msg = {b: 'foo', a: [1,2,3], c: [1,[{}]]}

// sign the message (only kp.secret is needed)
const signedMessage = JSONSign.sign(kp.secret, msg)

console.log(`signedMessage=${r(signedMessage)}`)

// check if signed message is valid
const valid = JSONSign.verify(signedMessage)

console.log(`valid=${r(valid)}`)
