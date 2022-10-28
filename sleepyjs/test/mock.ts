export function mockAsyncIterable<T>(data:T[]) {
    async function* mockAsyncIterable():AsyncGenerator<Awaited<T>, void, unknown> {
        for(let idx=0; idx < data.length; idx++) {
            const delay = 5 + Math.floor(Math.random() * 5);
            await new Promise(resolve => setTimeout(resolve, delay));  
            yield data[idx];
        }
    }
    return mockAsyncIterable();
}
