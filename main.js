const EdDSA = require('elliptic').eddsa
const secureRandom = require('secure-random')
const canonicalStringify = require('canonical-json')

// Create and initialize EdDSA context
// (better do it once and reuse it)
const ec = new EdDSA('ed25519')

// hex string to base64 string
const a2b = (a, b) => (x => new Buffer(x, a).toString(b))
const hex2base64 = a2b('hex', 'base64')
const base642hex = a2b('base64', 'hex')

// turn object into canonical hexadecimal string
const str2hex = str => new Buffer(str,'utf-8').toString('hex')

exports.keypair = function (secretSize) {
  const rnd = secureRandom(secretSize || 128, {type: 'Buffer'}).toString('hex')
  const key = ec.keyFromSecret(rnd, 'hex')
  return {
    secret: hex2base64(key.getSecret('hex')),
    public: hex2base64(key.getPublic('hex'))
  }
}

exports.sign = function (keypair, message) {
  const m = canonicalStringify(message)
  const mh = str2hex(m)
  const key = ec.keyFromSecret(base642hex(keypair.secret), 'hex')
  const sig = key.sign(mh)
  const sigEnc = hex2base64(sig.toHex().toLowerCase())

  // before returning, verify it, to be sure
  const verify = key.verify(mh, sig)
  if (!verify) {
    throw Error('Failed to verify?!?')
  }

  return {
    message: JSON.parse(m),
    signedBy: {
      pubkey: keypair.public || hex2base64(key.getPublic('hex')),
      signature: sigEnc
    }
  }
}

exports.verify = function (public, signedMessage) {
  const msg = signedMessage.message
  const sig = base642hex(signedMessage.signedBy.signature)
  const m = str2hex(canonicalStringify(signedMessage.message))
  const key = ec.keyFromPublic(base642hex(public), 'hex')
  const valid = key.verify(m, sig)
  return valid
}
