export type ContentActionError = {
  readonly field: string;
  readonly message: string;
};

export type ContentActionState = {
  readonly errors: readonly ContentActionError[];
  readonly message: string;
};

export const EMPTY_CONTENT_ACTION_STATE: ContentActionState = {
  errors: [],
  message: "",
};
