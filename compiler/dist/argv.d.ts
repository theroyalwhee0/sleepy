export interface ArgvShape {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
    source: string;
    target: string;
}
export declare function getArgv(): ArgvShape;
