// Unicode character classes
export const LETTERS = "\\p{L}"; // Any kind of letter
export const NUMBERS = "\\p{N}"; // Any kind of digit
export const PUNCTUATION = "\\p{P}";
export const SYMBOLS = "\\p{S}";
export const WHITESPACE = "\\s";
export const BUSINESS_NAME_EXCLUDED_CHARS = "\\^|~Ǻǻƒ";

const ALLOWED_NAME_CHARS = [
    ..."ABCDEFGHIJKLMNOŒPQRSTUVWXYZ",
    ..."Ææ",
    ..."ÀàÈèÌìÒòÙùẀẁỲỳ",
    ..."ÁáćǼǽÉģÍíĹĺŃńÓóŔŕŚśÚúẂẃÝýŹź",
    ..."ÂâĉÊêĜĝĤĥÎîĴĵÔôŜŝÛûŴŵŶŷ",
    ..."ÃãĨĩÑñÕõŨũ",
    ..."ÄäËëÏïÖöÜüẄẅŸÿ",
    ..."ÅåŮů",
    ..."abcdefghijklmnoœpqrstuvwxyz",
    ..."çŊŋŞşŢţĢĶķĻļŅņŖŗ",
    ..."ĐĦħŦŧ",
    ..."Ǿǿ"
];

const BUSINESS_ADDRESS_ALLOWED_CHARS = [...ALLOWED_NAME_CHARS, "0123456789Ǻǻƒ"];

export const BUSINESS_ADDRESS_ALLOWED_CHARS_STRING = `[${BUSINESS_ADDRESS_ALLOWED_CHARS}–\\-\\s'']`;
