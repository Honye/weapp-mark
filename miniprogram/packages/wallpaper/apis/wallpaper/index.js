import { request } from '../../../../utils/request';

export const fetchCategories = async () => {
  const { ok, data } = await request({
    url: 'https://mmovie.imarkr.com/360/bizhi/labels'
  });
  return ok ? data : Promise.reject(data);
}

/**
 * @param {object} data
 * @param {number} data.lid
 * @param {number} data.size
 * @param {number} data.page
 */
export const fetchListByCategory = async (data) => {
  const resp = await request({
    url: 'https://mmovie.imarkr.com/360/bizhi/list',
    data
  });
  return resp.ok ? resp.data : Promise.reject(resp.data);
}
