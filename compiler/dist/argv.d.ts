export interface ArgvShape {
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    source: string;
    target: string;
    details: boolean;
    o: boolean;
    optimize: boolean;
    overwrite: boolean;
}
export declare function getArgv(value?: string[], exit?: boolean): ArgvShape;
