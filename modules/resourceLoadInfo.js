const db = require('../config/db')
const Sequelize = db.sequelize;
const ResourceLoadInfo = Sequelize.import('../schema/resourceLoadInfo');
ResourceLoadInfo.sync({force: false});

class ResourceLoadInfoModel {
  /**
   * 创建ResourceLoadInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createResourceLoadInfo(data) {
    return await ResourceLoadInfo.create({
      ...data
    })
  }

  /**
   * 更新ResourceLoadInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateResourceLoadInfo(id, data) {
    await ResourceLoadInfo.update({
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
   * 获取ResourceLoadInfo列表
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoList() {
    return await ResourceLoadInfo.findAndCountAll()
  }

  /**
   * 获取ResourceLoadInfo详情数据
   * @param id  ResourceLoadInfo的ID
   * @returns {Promise<Model>}
   */
  static async getResourceLoadInfoDetail(id) {
    return await ResourceLoadInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除ResourceLoadInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteResourceLoadInfo(id) {
    await ResourceLoadInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoByUserId(webMonitorIdSql, customerKeySql, happenTimeSql) {
    let sql = "select * from ResourceLoadInfos where " + happenTimeSql + "and" + customerKeySql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoListByDay() {
    let sql = "select sourceUrl, COUNT(sourceUrl) as count from ResourceLoadInfos GROUP BY sourceUrl "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }


}

module.exports = ResourceLoadInfoModel
