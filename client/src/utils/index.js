import _ from 'lodash';

export const getDataInfo = (fields = [], object = null) => {
  return _.pick(object, fields);
};
