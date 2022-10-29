export interface ArgvShape {
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    source: string;
    target: string;
}
export declare function getArgv(value?: string[], exit?: boolean): ArgvShape;
