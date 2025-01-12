const baseInfo = require('./baseInfo');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('DailyActivity', {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 时间
    day: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 数量
    count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'webMonitorId'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'webMonitorId'
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false
  })

}