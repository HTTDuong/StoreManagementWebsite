export const stringUtil = {
  pad: (n, length, fill) => {
    fill = fill || '0';
    n = String(n);
    return n.length >= length
      ? n
      : new Array(length - n.length + 1).join(fill) + n;
  }
}