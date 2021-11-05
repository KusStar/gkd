export interface Flags {
  template: string;
  author: {
    name: string;
    page: string;
  };
}

export interface Context extends Flags {
  appName: string;
}
