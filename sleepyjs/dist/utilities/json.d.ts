export declare type JsonValue = JsonPrimative | JsonObject | JsonArray;
export declare type JsonPrimative = null | string | boolean | number;
export declare type JsonArray = JsonValue[];
export declare type JsonObject = {
    [key: string]: JsonValue;
};
