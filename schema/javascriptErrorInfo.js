const baseInfo = require('./baseInfo');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('JavascriptErrorInfo', {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // JS报错信息
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'errorMessage'
    },
    // JS报错堆栈
    errorStack: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'errorStack'
    },
    // 浏览器信息
    browserInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserInfo'
    },
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false
  })

}