export const cl = (...args: Array<string | undefined | boolean>) => {
    return args
        .join(' ')
        .replace(/undefined|false|true/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};
