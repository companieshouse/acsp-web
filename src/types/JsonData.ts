type JSONValue =
    | string
    | number
    | boolean
    /* eslint-disable-next-line no-use-before-define */
    | JSONObject
    /* eslint-disable-next-line no-use-before-define */
    | JSONArray;

interface JSONArray extends Array<JSONValue> { }

export interface JSONObject {
    [x: string]: JSONValue;
}
