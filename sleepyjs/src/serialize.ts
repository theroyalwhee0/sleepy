import { Compiled } from './compile';

export type SerializeOptions = {
    pretty?: boolean, // true = pretty, false of undefined to turn off
};

export async function* serializeCompiled(compiled: Compiled, options?: SerializeOptions): AsyncGenerator<string> {
    const pretty = options?.pretty ?? false;
    for await (const value of compiled.rows()) {
        if (pretty) {
            yield JSON.stringify(value, null, ' ').replace(/\s*\n\s*/g, ' ');
        } else {
            yield JSON.stringify(value);
        }
    }
}
