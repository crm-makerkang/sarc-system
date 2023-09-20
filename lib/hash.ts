
function hash(input: string): string {
  var hash = 0,
    i, chr;
  if (input.length === 0) return hash.toString(16);
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  if (hash < 0) {
    hash = Math.abs(hash);
  }
  return hash.toString(16);
}

export default hash