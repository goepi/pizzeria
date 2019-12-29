export interface TemplateStrings {
  [key: string]: string;
}

interface Config {
  templateStrings: TemplateStrings;
}

export const config: Config = {
  templateStrings: {},
};
