// Unicode character classes
export const LETTERS = "\\p{L}"; // Any kind of letter
export const NUMBERS = "\\p{N}"; // Any kind of digit
export const PUNCTUATION = "\\p{P}";
export const SYMBOLS = "\\p{S}";
export const WHITESPACE = "\\s";
export const BUSINESS_NAME_EXCLUDED_CHARS = "\\^|~Ǻǻƒ";

// Commmon allowed characters for name and business address/correspondence address
export const ALLOWED_TEXT_CHARS_SUFFIX = "'\\s–-";
export const ALLOWED_TEXT_CHARS = "A-ZŒÆæÀàÈèÌìÒòÙùẀẁỲỳÁáćǼǽÉéģÍíĹĺŃńÓóŔŕŚśÚúẂẃÝýŹźÂâĉÊêĜĝĤĥÎîĴĵÔôŜŝÛûŴŵŶŷÃãĨĩÑñÕõŨũÄäËëÏïÖöÜüẄẅŸÿÅåŮůa-zœçŊŋŞşŢţĢĶķĻļŅņŖŗĐĦħŦŧǾǿ";

// Allowed characters for ONLY business address/correspondence address
export const BUSINESS_ADDRESS_ALLOWED_CHARS = `${ALLOWED_TEXT_CHARS}0123456789Ǻǻƒ`;
