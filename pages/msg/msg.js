// pages/msg/msg.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        msgs: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getMsgs();
        console.log(this.data.msgs);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 
     * 查询消息中心列表 
     */
    getMsgs: function () {
        let that = this;
        util.request(api.msgsWithUser).then(function (res) {
            if (res.errno === 0) {
                let msgs = res.data;
                that.setData({
                    msgs: msgs
                });
            }
        });
    },
})