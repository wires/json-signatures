# JSON Signatures

Simplified API to sign and verify JSON data.

1. Call `sign(secret, jsonData)` to create a signed JSON object:

  ```js
  { data: { /* could be any JSON.stringify-able thing */ }
  , signature: {
      publicKey: 'base64-string',
      sig: 'base64-string'
    }
  }
  ```

2. Use `verify(signedData)` to check for a valid signature.

## Basic Example

> npm install --save json-signatures

```js
const JSgn = require('json-signatures')

const myMessage = { hello: "world, this is just an example" }

const keypair = JSgn.keypair() // => {public, secret}
const signed = JSgn.sign(keypair.secret, myMessage)  //=> {data, signature}
JSgn.verify(signed) //=> true

// also
signed.data === myMessage
keypair.public === signed.signature.publicKey
```

### About keys

Use `fresh()` obtain a secure random secret (as a base64 encoded string).

To derive the public key from it, call `pubkey(secret)` (again, a base64 string).

As a convenience, you can call `keypair()` to create both a fresh secret and it's public key.

```js
// number of bytes in random secret, optional!
const size = 128

// create random secret and derive public key
const f = JSgn.fresh(size) //=> "QM+USi7HbHU1/Dd22XN...D+LLpjw=="
const pk = JSgn.pubkey(f) //=> "HPe1gjvoUJ...VywQ0TxozE=

// or both in one go
const kp = JSgn.keypair(size) /* =>
   {
      public: "HPe1gjvok8tL8wYQUJ...VywQ0kjDEjTxozE=",
      secret: "QM+USi7HbuRHU1/DdYkzL322XNm3qJ...D+LLpjw=="
   }
*/
```

You can use your own secret, by passing a Buffer `b` to `sign(b)`, `pubkey(b)`,
or `keypair(b)`.

```js
const kp = JSgn.keypair(new Buffer('my!UltraSecretPWD31337'))
//=> { public: '...'
//   , secret: 'QM+USi7HbuRHU1/DdYkzL322XNm3qJ...D+LLpjw==' }
```

### Sign some data

You can sign any JSON, just pass a secret (base64-string).

```js
const msg = {b: 'foo', a: [1,2,3], c: [1,[{}]]}
const signedMessage = JSgn.sign(kp.secret, msg)
```

The resulting `signedMessage` will look like this (public key is derived from secret again):

```js
{
  data: msg,
  signature: {
    publicKey: kp.public,
    sig: "+AAhMxhhjvz5CUEbZcziqb...ds/g6xFbU8WXLkdbloOUHBw=="
  }
}
```

### Verify signed data

Later, you can verify is the data is signed by a the secret
corresponding to the public key.

```js
// see if it has a valid signature
JSgn.verify(signedMessage) // => true
```


## Links

- Algorithm used is [ed2219](https://ed25519.cr.yp.to/) = (Curve25519 + EdDSA) [see pg. 7](https://ed25519.cr.yp.to/ed25519-20110926.pdf)
- Implementation is [elliptic](https://github.com/indutny/elliptic)
- Uses [`secure-random`](npm.im/secure-random) to generate secret
- Uses [`canonical-json`](npm.im/canonical-json) to create the string on which the signature is based. Also http://wiki.laptop.org/go/Canonical_JSON
