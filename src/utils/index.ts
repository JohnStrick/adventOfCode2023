export const gcd = (a: number, b: number): number => b == 0 ? a : gcd (b, a % b);
export const lcm = (a: number, b: number): number =>  a / gcd (a, b) * b;
export const lcmAll = (ns: number[]): number => ns.reduce(lcm, 1);

export function useMemo<Args extends unknown[], T>(
    func: (...args: Args) => T, 
    getKey: (args: Args) => string
): (...args: Args) => T {
    const stored = new Map<string, T>();

    return (...args) => {
        const k = getKey ? getKey(args) : JSON.stringify(args);
        if (stored.has(k)) {
            return stored.get(k)!;
        }
        const result = func(...args);
        stored.set(k, result);
        return result;
    };
}