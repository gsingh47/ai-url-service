import express from 'express';

import { getToken, getSearchCriteria, getCustomer } from '../controller/base-controller';

export default (router: express.Router) => {
  router.get('/token', getToken);
  router.post('/getSearchCriteria', getSearchCriteria);
  router.post('/isAuthorizedUser', getCustomer);
};