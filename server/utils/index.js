import _ from 'lodash';

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const getDataInfo = (fields = [], object = null) => {
  return _.pick(object, fields);
};
