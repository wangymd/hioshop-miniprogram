var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        navList: [],
        categoryList: [],
        currentCategory: {},
        goodsCount: 0,
        nowIndex: 0,
        nowId: 0,//选中的种类
        list: [],
        initPageNo: 1,
        initPageSize: 8,
        pageNo: 1,
        pageSize: 8,
        noDataRetryTimes: 0,
        hasInfo: 0,
        showNoMore: 0,
        loading:0,
        index_banner_img:0,
    },
    onLoad: function(options) {
    },
    getChannelShowInfo: function (e) {
        let that = this;
        util.request(api.ShowSettings).then(function (res) {
            if (res.success) {
                let index_banner_img = res.data.indexBannerImg;
                that.setData({
                    index_banner_img: index_banner_img
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getCatalog();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    getCatalog: function() {
        //CatalogList
        let that = this;
        util.request(api.CatalogList).then(function(res) {
            that.setData({
                navList: res.data,
            });
        });
        util.request(api.GoodsCount).then(function(res) {
            that.setData({
                goodsCount: res.data
            });
        });
    },
     //获取当前种类
    getCurrentCategory: function(id) {
        let that = this;
        util.request(api.CatalogCurrent, {
            id: id
        }).then(function(res) {
            that.setData({
                currentCategory: res.data
            });
        });
    },

    //获取当前页
    getCurrentList: function(id) {
        let that = this;
        util.request(api.GetCategoryGoods, {
            pageSize: that.data.pageSize,
            pageNo: that.data.pageNo,
            categoryId: id
        }, 'POST').then(function(res) {
            if (res.success) {
                let count = res.data.length;
                that.setData({
                    list: that.data.list.concat(res.data),//将查询数据，追加到集合
                    showNoMore: 1,
                    loading: 0,
                });
                if (count == 0) {
                    that.setData({
                        noDataRetryTimes: that.data.noDataRetryTimes + 1,
                        hasInfo: 0,
                        showNoMore: 0
                    });
                }
            }
        });
    },
    //展示数据
    onShow: function() {
        this.getChannelShowInfo();
        let id = this.data.nowId;
        //从本地缓存中同步获取指定 key 的内容
        let nowId = wx.getStorageSync('categoryId');
        if(id == 0 && nowId === 0){
            return false
        }
        else if (nowId == 0 && nowId === '') {
            this.setData({
                list: [],
                pageNo: this.data.pageNo,
                pageSize: this.data.pageSize,
                loading: 1
            })
            this.getCurrentList(0);
            this.setData({
                nowId: 0,
                currentCategory: {}
            })
            wx.setStorageSync('categoryId', 0)
        } else if(id != nowId) {
            this.setData({
                list: [],
                pageNo: this.data.pageNo,
                pageSize: this.data.pageSize,
                loading: 1
            })
            this.getCurrentList(nowId);
            this.getCurrentCategory(nowId);
            this.setData({
                nowId: nowId
            })
            wx.setStorageSync('categoryId', nowId)
        }
        
        this.getCatalog();
    },

    //选择分类
    switchCate: function(e) {
        let id = e.currentTarget.dataset.id;
        let nowId = this.data.nowId;
        if (id == nowId) {
            return false;
        } else {
            this.setData({
                list: [],
                pageNo: this.data.initPageNo,
                pageSize: this.data.initPageSize,
                loading: 1
            })
            if (id == 0) {
                this.getCurrentList(0);
                this.setData({
                    currentCategory: {}
                })
            } else {
                wx.setStorageSync('categoryId', id)
                this.getCurrentList(id);
                this.getCurrentCategory(id);
            }
            wx.setStorageSync('categoryId', id)
            this.setData({
                nowId: id
            })
        }
    },
    onBottom: function() {
        console.log("onBottom");
        let that = this;
        
        console.log("noDataRetryTimes:" + this.data.noDataRetryTimes);
        if(this.data.noDataRetryTimes >= 3){
            that.setData({
                hasInfo: 0,
                showNoMore: 0
            });
            return false;
        }
        that.setData({
            pageNo: that.data.pageNo + 1
        });
        console.log("onBottom-pageNo:" + that.data.pageNo);
        let nowId = that.data.nowId;
        console.log("onBottom-nowId:" + nowId);
        if (nowId == 0 || nowId == undefined) {
            that.getCurrentList(0);
        } else {
            that.getCurrentList(nowId);
        }
    }
})