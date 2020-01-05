import { ContentType, HandlerCallback, isValidContentType } from '../../router/types';
import { getStaticAsset } from '../../server/helpers';
import { ParsedRequest } from '../../server/types';

export const publicHandler = {
  get: (data: ParsedRequest, callback: HandlerCallback<Buffer>) => {
    if (data.pathVariables && data.pathVariables.filename) {
      const filename = data.pathVariables.filename;
      getStaticAsset(data.pathVariables.filename, (err, assetData) => {
        console.log(assetData);
        if (!err && assetData) {
          const contentType = getContentType(filename);
          if (contentType) {
            callback(200, assetData, contentType);
          } else {
            callback(200, assetData, 'plain');
          }
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  },
};

const getContentType = (filename: string): ContentType | false => {
  const [_, ext] = filename.split('.');

  if (ext && isValidContentType(ext)) {
    return ext;
  } else {
    return false;
  }
};
