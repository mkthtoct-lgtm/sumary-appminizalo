declare namespace React {
  type ReactNode = any;
  type CSSProperties = Record<string, string | number | undefined>;
  type MouseEvent<T = Element, E = globalThis.MouseEvent> = E & {
    currentTarget: T;
    target: EventTarget;
  };

  interface HTMLAttributes<T> {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    [key: string]: any;
  }

  type DetailedHTMLProps<E, T> = E & { ref?: any; key?: any };

  type FunctionComponent<P = {}> = (props: P & { children?: ReactNode }) => any;
  type FC<P = {}> = FunctionComponent<P>;
  type ComponentType<P = {}> = FunctionComponent<P>;
}

declare module "react" {
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  export type MouseEvent<T = Element, E = globalThis.MouseEvent> = React.MouseEvent<T, E>;
  export interface HTMLAttributes<T> extends React.HTMLAttributes<T> {}
  export type DetailedHTMLProps<E, T> = React.DetailedHTMLProps<E, T>;
  export type FunctionComponent<P = {}> = React.FunctionComponent<P>;
  export type FC<P = {}> = React.FC<P>;
  export type ComponentType<P = {}> = React.ComponentType<P>;

  export function useState<S>(
    initialState: S | (() => S)
  ): [S, (value: S | ((previousState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps?: readonly any[]): T;
  export function useRef<T>(initialValue: T): { current: T };

  const React: {
    createElement: (...args: any[]) => any;
    Fragment: any;
    useState: typeof useState;
    useEffect: typeof useEffect;
    useMemo: typeof useMemo;
    useRef: typeof useRef;
  };

  export default React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}
