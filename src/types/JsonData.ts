type JSONValue =
    | string
    | number
    | boolean
    | JSONObject // eslint-disable-line no-use-before-define
    | JSONArray; // eslint-disable-line no-use-before-define

interface JSONArray extends Array<JSONValue> { }

export interface JSONObject {
    [x: string]: JSONValue;
}
