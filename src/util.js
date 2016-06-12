module.exports = {
    generatorAdapter: (iterable) => {
        let index = 0;
        const generatorFn = function* () {
            for (let c of iterable) {
                ++index;
                yield c;
            }
        };

        const generator = generatorFn(iterable);

        return {
            getNext: () => generator.next().value,
            peek: () => iterable[index]
        };
    }
};