/**
 * Escapes special regex metacharacters in a string to make it safe for RegExp construction
 * @param {string} value
 * @returns {string}
 */
const escapeRegex = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = {
  escapeRegex,
};
