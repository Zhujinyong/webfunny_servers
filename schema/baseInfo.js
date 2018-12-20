const moment = require('moment');
module.exports = (DataTypes) => {
  return {
    // 日志类型
    uploadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'uploadType'
    },
    // 发生时间
    happenTime: {
      type: DataTypes.STRING(13),
      allowNull: true,
      field: 'happenTime'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 用户标识ID
    pageKey: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'pageKey'
    },
    // 用户标识ID
    customerKey: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'customerKey'
    },
    // 设备名称
    deviceName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'deviceName'
    },
    // 系统信息
    os: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'os'
    },
    // 浏览器名称
    browserName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'browserName'
    },
    // 浏览器版本号
    browserVersion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserVersion'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'monitorIp'
    },
    // 国家
    country: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'country'
    },
    // 省份
    province: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'province'
    },
    // 城市
    city: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'city'
    },
    // 发生的页面URL
    simpleUrl: {
      type: DataTypes.TEXT,
        allowNull: true,
        field: 'simpleUrl'
    },
    // 发生的页面完整的URL
    completeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'completeUrl'
    },
    // 自定义用户标识ID
    userId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'userId'
    },
    // 自定义用户参数1
    firstUserParam: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'firstUserParam'
    },
    // 自定义用户参数2
    secondUserParam: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'secondUserParam'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }
}