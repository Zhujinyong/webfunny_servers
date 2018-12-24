const db = require('../config/db')
const Sequelize = db.sequelize;
const HttpLogInfo = Sequelize.import('../schema/HttpLogInfo');
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
  static async getHttpLogsByUser(param, customerKeySql) {
    let sql = "select * from HttpLogInfos where " + customerKeySql + " and webMonitorId='" + param.webMonitorId + "' "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

module.exports = HttpLogInfoModel
