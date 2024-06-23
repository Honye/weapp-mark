const db = wx.cloud.database();

export const getBanners = () => {
  return db.collection('banners')
    .orderBy('id', 'desc')
    .limit(4)
    .get()
    .then(({ data }) => data);
};
