const db = require('../config/db')
const Sequelize = db.sequelize;
const DailyActivity = Sequelize.import('../schema/dailyActivity');
DailyActivity.sync({force: false});

class DailyActivityModel {
  /**
   * 创建DailyActivity信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createDailyActivity(data) {
    return await DailyActivity.create({
      ...data
    })
  }

  /**
   * 更新DailyActivity数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateDailyActivity(id, data) {
    await DailyActivity.update({
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
   * 获取DailyActivity列表
   * @returns {Promise<*>}
   */
  static async getDailyActivityList() {
    return await DailyActivity.findAndCountAll()
  }

  /**
   * 获取DailyActivity详情数据
   * @param id  DailyActivity的ID
   * @returns {Promise<Model>}
   */
  static async getDailyActivityDetail(id) {
    return await DailyActivity.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除DailyActivity
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteDailyActivity(id) {
    await DailyActivity.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

module.exports = DailyActivityModel
