const db = require('../config/db')
const Sequelize = db.sequelize;
const ScreenShotInfo = Sequelize.import('../schema/ScreenShotInfo');
ScreenShotInfo.sync({force: false});

class ScreenShotInfoModel {
  /**
   * 创建ScreenShotInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createScreenShotInfo(data) {
    return await ScreenShotInfo.create({
      ...data
    })
  }

  /**
   * 更新ScreenShotInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateScreenShotInfo(id, data) {
    await ScreenShotInfo.update({
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
   * 获取ScreenShotInfo列表
   * @returns {Promise<*>}
   */
  static async getScreenShotInfoList() {
    return await ScreenShotInfo.findAndCountAll()
  }

  /**
   * 获取ScreenShotInfo详情数据
   * @param id  ScreenShotInfo的ID
   * @returns {Promise<Model>}
   */
  static async getScreenShotInfoDetail(id) {
    return await ScreenShotInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除ScreenShotInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteScreenShotInfo(id) {
    await ScreenShotInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

module.exports = ScreenShotInfoModel
