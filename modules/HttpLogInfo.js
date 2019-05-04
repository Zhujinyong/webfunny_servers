const db = require('../config/db')
const Sequelize = db.sequelize;
const HttpLogInfo = Sequelize.import('../schema/HttpLogInfo');
const Utils = require('../util/utils');
HttpLogInfo.sync({force: false});

class HttpLogInfoModel {
  /**
   * 创建HttpLogInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createHttpLogInfo(data) {
    return await HttpLogInfo.create({
      ...data
    })
  }

  /**
   * 更新HttpLogInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateHttpLogInfo(id, data) {
    await HttpLogInfo.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取HttpLogInfo列表
   * @returns {Promise<*>}
   */
  static async getHttpLogInfoList() {
    return await HttpLogInfo.findAndCountAll()
  }

  /**
   * 获取HttpLogInfo详情数据
   * @param id  HttpLogInfo的ID
   * @returns {Promise<Model>}
   */
  static async getHttpLogInfoDetail(id) {
    return await HttpLogInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除HttpLogInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteHttpLogInfo(id) {
    await HttpLogInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getHttpLogsByUser(webMonitorIdSql, customerKeySql, happenTimeSql) {
    let sql = "select * from HttpLogInfos where " + customerKeySql + " and " + happenTimeSql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteHttpLogInfoFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from HttpLogInfos where createdAt<'" + timeScope + "'"
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 获取24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoListByHour(param) {
    const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(id) AS count " +
      "FROM HttpLogInfos " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and `status`>201 and DATE_FORMAT(NOW() - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
      "GROUP BY HOUR"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoListSevenDayAgoByHour(param) {
    const tempNowHour = new Date().getHours();
    let nowHour = tempNowHour
    let sevenDayAgo = ""
    if (tempNowHour === 23) {
      sevenDayAgo = Utils.addDays(-5) + " 00:00:00";
    } else {
      nowHour = nowHour + 1
      sevenDayAgo = Utils.addDays(-6) + " " + nowHour + ":00:00";
    }
    const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(id) AS count " +
      "FROM HttpLogInfos " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and `status`>201 and createdAt<'" + sevenDayAgo + "' and DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 7 DAY) - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
      "GROUP BY HOUR"
    // return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfos where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

module.exports = HttpLogInfoModel
