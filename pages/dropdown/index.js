var cityData = require('../../utils/city.js');

// page/one/index.js
Page({
  data:{
    selectedProvince: '',
    selectedCity: '',
    currentNav: 0,
    cityleft: cityData.getCity(),
    citycenter: {},
    cityright: {},
    clothes: ['衣服', '裤子', '内衣', '服饰', '衣服', '裤子', '内衣', '服饰', '衣服', '裤子', '内衣', '服饰'],
    sorts: ['默认排序', '离我最近', '价格最低', '价格最高']
  },

  /**
   * 显示区域筛选
   */
  onNavChange: function(e){
    const navIndex = e.currentTarget.dataset.nav;
    if(navIndex === this.data.currentNav){
      this.setData({
        currentNav: 0
      })
    }else{
      this.setData({
        currentNav: navIndex
      })
    }
  },
  /**
   * 选择省份
   */
  onProvinceSelect: function(e){
    const { province } = e.currentTarget.dataset;
    this.setData({
      cityright:{},
      citycenter: this.data.cityleft[province],
      selectedProvince: province,
      selectedCity:''
    });
  },
  /**
   * 选择城市
   */
  onCitySelect: function(e){
    const { city } = e.currentTarget.dataset;
    this.setData({
      cityright:this.data.citycenter[city],
      selectedCity: city
    });
  },
  /**
   * 关闭所有下拉菜单 隐藏透明背景
   */
  hidebg: function(e){
    this.setData({
      currentNav: 0
    })
  },
})