import { DataObject, StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { Menu } from '../../data/types';
import { validateMenuId } from '../requestValidation';
import { dataInterface } from '../../data';

export interface MenusHandler {
  get: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | Menu) => void) => void;
}

export const menusHandler: MenusHandler = {
  get: (data, callback) => {
    const menuId = validateMenuId(data.queryStringObject.menuId);

    if (menuId) {
      dataInterface.read('menus', menuId, (err, menuData) => {
        if (!err && menuData) {
          callback(200, menuData);
        } else {
          callback(500, { error: 'Error getting menu.' });
        }
      });
    } else {
      callback(400, { error: 'Missing menu id parameter.' });
    }
  },
};
