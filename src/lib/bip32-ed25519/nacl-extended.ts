import nacl from "tweetnacl";

// The code in this module is taken almost verbatim from tweetnacl-js.

const naclAny = nacl as any; // workaround: .d.ts doesn't export nacl.lowlevel even though .js does.
const { scalarbase, pack25519, M, gf, S, crypto_hash, modL } = naclAny.lowlevel;

/**
 * Convert extended key to public key.
 */
export function extendedToPubkey(extendedKey: Uint8Array): Uint8Array {
  let pubkey = new Uint8Array(32);
  var p = [gf(), gf(), gf(), gf()];

  scalarbase(p, extendedKey);
  pack(pubkey, p);
  return pubkey;
}

/**
 * Create a detached ed25519 signature from a message and an extended key.
 * Note that the original tweetnacl function uses the secret key, which is used to
 * generate the extended key. Here we skip that step as we are directly provided
 * the extendedKey.
 */
export function signExtended(msg: Uint8Array, extendedKey: Uint8Array) {
  if (extendedKey.length !== 64) throw new Error("bad extended key size");
  var signedMsg = new Uint8Array(64 + msg.length);
  crypto_sign_extended(signedMsg, msg, msg.length, extendedKey);

  // crypto_sign_extended attaches the message to the output parameter signedMsg
  // We create a new array and copy the first 64 bytes, which is the signature.
  var sig = new Uint8Array(64);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
}

// ------------------ tweetnacl stuff --------------------------------------- //

/**
 * `crypto_sign_extended` is adapted from tweetnacl's `crypto_sign` to use the
 * extended key instead of the secret key.
 * `crypto_sign` generates the extended key from the secret key.
 * `crypto_sign_extended` accepts the extended key as an argument instead
 * of the secret.
 */
function crypto_sign_extended(
  sm: Uint8Array,
  m: Uint8Array,
  n: number,
  xk: Uint8Array,
) {
  var h = new Uint8Array(64),
    r = new Uint8Array(64);
  var i,
    j,
    x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  let pk = extendedToPubkey(xk);

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = xk[32 + i];

  crypto_hash(r, sm.subarray(32), n + 32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 0; i < 32; i++) sm[i + 32] = pk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i + j] += h[i] * xk[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

// The following functions are taken from tweetnacl verbatim because tweetnacl
// doesn't export them.

// @ts-ignore
function pack(r, p) {
  var tx = gf(),
    ty = gf(),
    zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

// @ts-ignore
function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if (a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

// @ts-ignore
function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

// @ts-ignore
function reduce(r) {
  var x = new Float64Array(64),
    i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}
