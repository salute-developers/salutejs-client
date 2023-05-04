export type CreateComponentParams<
    Props extends Record<string, unknown>,
    State extends Record<string, unknown>,
    Refs extends Record<string, HTMLElement>,
> = {
    baseHTMLTemplate: string;
    createRefs: (root: HTMLDivElement) => Refs;
    render: (params: {
        refs: Refs;
        props: Props;
        state: State;
        setState: (modi: Partial<State> | ((prevState: State) => Partial<State>)) => void;
        effect: (cb: () => (() => void) | void, deps: unknown[]) => void;
    }) => () => void;
};

export const createComponent = <
    Props extends Record<string, unknown>,
    State extends Record<string, unknown>,
    Refs extends Record<string, HTMLElement>,
>({
    baseHTMLTemplate,
    createRefs,
    render,
}: CreateComponentParams<Props, State, Refs>) => {
    const effects: { deps: { [id: number]: { arr: unknown[]; calls: 0 } }; offs: { [id: number]: () => void } } = {
        deps: {},
        offs: {},
    };

    let root: HTMLDivElement | null = null;
    let refs: Refs | null = null;
    let lastProps: Props | null = null;
    let state: State = {} as State;
    let setState: (modi: Partial<State> | ((prevState: State) => Partial<State>)) => void = () => {};
    let renderMode: 'lock' | 'release' = 'release';
    let renderId = -1;

    const uneffects = () => {
        Object.values(effects.offs).forEach((off) => off());

        effects.deps = {};
        effects.offs = {};
    };

    const unmount = () => {
        uneffects();
        root?.remove();
        lastProps = null;
        state = {} as State;
        renderMode = 'release';
        window.clearTimeout(renderId);
    };

    const tryRender = (ren: () => void) => {
        if (renderMode === 'release') {
            renderMode = 'lock';

            window.clearTimeout(renderId);

            renderId = window.setTimeout(() => {
                ren();

                renderMode = 'release';
            }, 20);
        }
    };

    const update = (props: Props) => {
        lastProps = props;

        if (root && refs) {
            let currentDepsId = -1;

            const effect = (cb: () => (() => void) | void, deps: unknown[]) => {
                currentDepsId += 1;

                if (!effects.deps[currentDepsId]) {
                    effects.deps[currentDepsId] = {
                        arr: [],
                        calls: 0,
                    };
                }

                const { arr: prevDeps, calls } = effects.deps[currentDepsId];
                const updateOnce = deps.length === 0 && calls === 0;
                const updated = updateOnce || calls === 0 || prevDeps.some((prev, index) => prev !== deps[index]);

                if (updated) {
                    effects.deps[currentDepsId].arr = deps;
                    effects.deps[currentDepsId].calls += 1;

                    if (typeof effects.offs[currentDepsId] === 'function') {
                        effects.offs[currentDepsId]();
                    }

                    const off = cb();

                    if (typeof off === 'function') {
                        effects.offs[currentDepsId] = off;
                    }
                }
            };

            tryRender(render({ refs, props, state, setState, effect }));
        }
    };

    setState = (modi) => {
        const nextState = typeof modi === 'function' ? modi(state) : modi;

        state = {
            ...(state || {}),
            ...nextState,
        };

        if (lastProps) {
            update(lastProps);
        }
    };

    const mount = (element: HTMLDivElement, props: Props) => {
        unmount();

        root = element;
        root.innerHTML = baseHTMLTemplate;
        refs = createRefs(root);

        update(props);
    };

    return {
        mount,
        unmount,
        update,
        get mounted() {
            return !!(root && refs);
        },
    };
};
