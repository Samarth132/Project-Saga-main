export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type AlertColor = 'success' | 'info' | 'warning' | 'error';