// Unicode character classes
export const LETTERS = "\\p{L}"; // Any kind of letter
export const NUMBERS = "\\p{N}"; // Any kind of digit
export const PUNCTUATION = "\\p{P}";
export const SYMBOLS = "\\p{S}";
export const WHITESPACE = "\\s";
export const BUSINESS_NAME_EXCLUDED_CHARS = "\\^|~Ǻǻƒ";

// Commmon allowed characters for name and business address/correspondence address
export const ALLOWED_TEXT_CHARS_SUFFIX = "'\\s-";
const ALLOWED_TEXT_CHARS_BASE = "A-ZŒÆæÀàÈèÌìÒòÙùẀẁỲỳÁáćǼǽÉéģÍíĹĺŃńÓóŔŕŚśÚúẂẃÝýŹźÂâĉÊêĜĝĤĥÎîĴĵÔôŜŝÛûŴŵŶŷÃãĨĩÑñÕõŨũÄäËëÏïÖöÜüẄẅŸÿÅåŮůa-zœçŊŋŞşŢţĢĶķĻļŅņŖŗĐĦħŦŧǾǿ";
export const ALLOWED_TEXT_CHARS = `${ALLOWED_TEXT_CHARS_BASE}${ALLOWED_TEXT_CHARS_SUFFIX}`;

// Allowed characters for ONLY business address/correspondence address
const BUSINESS_ADDRESS_ALLOWED_CHARS_BASE = `${ALLOWED_TEXT_CHARS_BASE}0123456789Ǻǻƒ`;
export const BUSINESS_ADDRESS_ALLOWED_CHARS = `${BUSINESS_ADDRESS_ALLOWED_CHARS_BASE}${ALLOWED_TEXT_CHARS_SUFFIX}`;
