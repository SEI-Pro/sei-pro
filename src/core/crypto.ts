// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Browser-native cryptographic helpers.
 *
 * MD5 remains in CryptoJS for the legacy integrity comparison. SHA-256 is
 * always calculated with Web Crypto and therefore never blocks the UI thread.
 */
export async function sha256Hex(input, cryptoApi = globalThis.crypto) {
    if (!cryptoApi?.subtle?.digest) {
        throw new Error('Web Crypto SHA-256 is unavailable in this context');
    }

    let data = input;
    if (data instanceof ArrayBuffer) {
        // Keep the original buffer untouched.
    } else if (ArrayBuffer.isView(data)) {
        data = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    } else if (typeof data === 'string') {
        data = new TextEncoder().encode(data);
    } else if (data && typeof data.arrayBuffer === 'function') {
        data = await data.arrayBuffer();
    } else {
        throw new TypeError('SHA-256 input must be text, bytes, ArrayBuffer, Blob, or File');
    }

    const digest = await cryptoApi.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

