// @ts-nocheck
import * as crypto from "@walletconnect/crypto";
import * as encoding from "@walletconnect/encoding";
import { format } from "timeago.js";
import moment from "moment-timezone";
import numeral from "numeral";
import networks from '@snapshot-labs/snapshot.js/src/networks.json';

export function uuid() {
  const result = ((a, b) => {
    for (
      b = a = "";
      a++ < 36;
      b +=
        (a * 51) & 52
          ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
          : "-"
    ) {}
    return b;
  })();
  return result;
}

export function generateKey(length?: number): Promise<ArrayBuffer> {
  const _length = (length || 256) / 8;
  const bytes = crypto.randomBytes(_length);
  const result = convertBufferToArrayBuffer(encoding.arrayToBuffer(bytes));

  return result;
}

export function convertBufferToArrayBuffer(buf: Buffer): ArrayBuffer {
  return encoding.bufferToArray(buf).buffer;
}

export function convertArrayBufferToHex(
  arrBuf: ArrayBuffer,
  noPrefix?: boolean
): string {
  return encoding.arrayToHex(new Uint8Array(arrBuf), !noPrefix);
}

export function shortenAddress(str = "") {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === "number") limit = key;
  if (key === "symbol") limit = 6;
  if (key === "name") limit = 64;
  if (key === "choice") limit = 12;
  if (limit) {
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  }

  return shortenAddress(str);
}

export function getTimeAgo(number) {
  return format(number * 1e3);
}

export function dateFormat(number, format?: string | undefined) {
  let setFormat = "MMM DD, YYYY HH:mm";
  return moment(number * 1e3).format(format ?? setFormat);
}

export function n(number, format = "(0.[00]a)") {
  if (number < 0.00001) return format.includes("%") ? "0%" : 0;
  return numeral(number).format(format);
}

export function explorerUrl(network, str: string, type = "address"): string {
  return `${networks[network].explorer}/${type}/${str}`;
}