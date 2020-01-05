export interface TemplateStrings {
  [key: string]: string;
}

interface Config {
  templateStrings: TemplateStrings;
}

export const config: Config = {
  templateStrings: {
    appName: 'Pizzeria',
    yearCreated: '2020',
    companyName: 'Pizzeria',
  },
};
