import { Compiled } from './compile';

export type SerializeOptions = {
    pretty?: boolean, // true = pretty, false of undefined to turn off
};

export function serializeCompiled(compiled: Compiled, options?: SerializeOptions): string {
    const pretty = options?.pretty ?? false;
    return compiled.rows.map((value): string => {
        if (pretty) {
            return JSON.stringify(value, null, ' ').replace(/\s*\n\s*/g, ' ');
        } else {
            return JSON.stringify(value);
        }
    }).join('\n');
}