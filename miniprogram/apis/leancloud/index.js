import * as AV from '../../libs/av-live-query-core-min';

/**
 * @returns {Promise<any[]>}
 */
export const getBanners = async () => {
  const query = new AV.Query('Banner');
  const data = await query.find();
  return data.map((item) => {
    const { attributes, ...cols } = item;
    return { ...cols, ... attributes };
  });
};
