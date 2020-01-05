import { HandlerCallback } from '../../router/types';
import { getTemplate, mergeWithGlobalTemplates } from '../../server/helpers';
import { ParsedRequest } from '../../server/types';

export const indexHandler = {
  get: (data: ParsedRequest, callback: HandlerCallback<string>) => {
    const templateData = {
      'head.title': 'Pizzeria',
      'head.description': 'Tasty treats',
      'body.class': 'index',
    };

    getTemplate('index', templateData, (err: boolean, mainContent?: string) => {
      if (!err && mainContent) {
        mergeWithGlobalTemplates(mainContent, templateData, (mergeErr: boolean, fullTemplate?: string) => {
          if (!mergeErr && fullTemplate) {
            callback(200, fullTemplate, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  },
};
