# JSON Signatures

Simplified API to sign and verify JSON data. Summary:

```js
const JSONSign = require('json-signatures')

// create keypair
const kp = JSONSign.keypair()

// whatever, sign it
const msg = {b: 'foo', a: [1,2,3], c: [1,[{}]]}
const signedMessage = JSONSign.sign(kp, msg)

// see if it has a valid signature
JSONSign.verify(signedMessage) // => true
```

Basically, it takes a JSON message `M` and a secret key,
and turns it into JSON which can be used to verify M:

```js
{ message: M
, signedBy: {
    pubkey: "HPe1gjvok8tL8wYQUJKnYHhWxhPNVywQ0kjDEjTxozE=",
    signature: "DRV1bnJamWrW73oMHIqYDRiO71SH0IdJL...g969qzh0Ag=="
  }
}
```

## Detailed usage

> npm install --save json-signatures

First, create a key pair.

```
const kp = JSONSign.keypair(nrOfRandomBytesForSecret)
```

It looks like

```js
{
  public: "HPe1gjvok8tL8wYQUJ...VywQ0kjDEjTxozE=",
  secret: "QM+USi7HbuRHU1/DdYkzL322XNm3qJ...D+LLpjw=="
}
```

Then, you can use it to sign a JSON dictionary,

```js
const signedMessage = JSONSign.sign(kp, M)
```

A missing `kp.public` value will be derived from the `kp.secret`.

The resulting `signedMessage` will look like this:

```js
{
  message: M,
  signedBy: {
    pubkey: kp.public,
    signature: "+AAhMxhhjvz5CUEbZcziqb...ds/g6xFbU8WXLkdbloOUHBw=="
  }
}
```

Later, only a public key is needed to verify a message:

```js
if (! JSONSign.verify(signedMessage) ) {
  // message was tampered with
}
```

## Links

- Algorithm used is [ed2219](https://ed25519.cr.yp.to/) = (Curve25519 + EdDSA) [see pg. 7](https://ed25519.cr.yp.to/ed25519-20110926.pdf)
- Implementation is [elliptic](https://github.com/indutny/elliptic)
- Uses [`secure-random`](npm.im/secure-random) to generate secret
- Uses [`canonical-json`](npm.im/canonical-json) to create the string on which the signature is based
