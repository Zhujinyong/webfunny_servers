const BehaviorInfoModel = require('../modules/behaviorInfo')
const JavascriptErrorInfoModel = require('../modules/javascriptErrorInfo')
const ScreenShotInfo = require('../modules/ScreenShotInfo')
const CustomerPVModel = require('../modules/customerPV')
const IgnoreErrorModel = require('../modules/ignoreError')
const statusCode = require('../util/status-code')
const fetch = require('node-fetch')
const Utils = require('../util/utils');
class Common {
  /**
   * 接受并分类处理上传的日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async uploadLog(ctx) {
    var req = ctx.req
    const clientIpString = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    // const tempArr = clientIpString.split(":")
    // const clientIp = tempArr[tempArr.length - 1]
    // const ipPath = "http://ip.taobao.com/service/getIpInfo.php?ip=" + clientIp
    let province = ""
    let city = ""
    // await fetch(ipPath)
    //   .then( res => res.text())
    //   .then( body => {
    //     try {
    //       const obj = JSON.parse(body);
    //       province = obj.data.region || "未知";
    //       city = obj.data.city;
    //     } catch(e) {
    //       province = "未知";
    //       city = "未知";
    //     }
    //   });
    const logInfoStr = ctx.request.body.data.replace(/"\\":/g, '"')
    const param = JSON.parse(logInfoStr)
    const logArray = param.logInfo.split("$$$")
    for(var i = 0; i < logArray.length; i ++) {
      if (!logArray[i]) continue;
      const logInfo = JSON.parse(logArray[i]);
      logInfo.monitorIp = clientIpString
      logInfo.province = province
      logInfo.city = city
      switch (logInfo.uploadType) {
        case "ELE_BEHAVIOR":
          await BehaviorInfoModel.createBehaviorInfo(logInfo);
          break;
        case "JS_ERROR":
          const arr = await IgnoreErrorModel.getIgnoreErrorByMsg(logInfo);
          const count = arr[0].count
          if (count <= 0) {
            await JavascriptErrorInfoModel.createJavascriptErrorInfo(logInfo);
          }
          break;
        case "SCREEN_SHOT":
          await ScreenShotInfo.createScreenShotInfo(logInfo)
          break;
        case "CUSTOMER_PV":
          await CustomerPVModel.createCustomerPV(logInfo);
          break;
        default:
          break;
      }
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功')
  }

  /**
   * 根据查询参数，查询出该用户所有的行为记录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async searchBehaviorsRecord(ctx) {
    const param = JSON.parse(ctx.request.body)
    param.happenTimeScope = new Date(Utils.addDays(0 - param.timeScope)).getTime()
    let customerKeyList = []
    let result1 = []
    let result2 = []
    let result3 = []
    let result = []
    // 查询当前用户的customerKey列表
    await CustomerPVModel.getCustomerKeyByUserId(param).then((res) => {
      res.forEach((customerKeyInfo) => {
        customerKeyList.push(customerKeyInfo.customerKey)
      })
    })
    let customerKeySql = ""
    if (customerKeyList.length) {
      customerKeyList.forEach((customerKey, index) => {
        if (index === customerKeyList.length -1) {
          customerKeySql += "happenTime>" + param.happenTimeScope + " and customerKey='" + customerKey + "' "
        } else {
          customerKeySql += "happenTime>" + param.happenTimeScope + " and customerKey='" + customerKey + "' or "
        }
      })
    } else {
      // 如果userId查不到，则用customerKey来进行查询
      customerKeySql += "happenTime>" + param.happenTimeScope + " and customerKey='" + param.searchValue + "' "
    }

    await BehaviorInfoModel.getBehaviorsByUser(param, customerKeySql).then((res) => {
      result1 = res
    })
    await CustomerPVModel.getBehaviorsByUser(param, customerKeySql).then((res) => {
      result2 = res
    })
    await JavascriptErrorInfoModel.getBehaviorsByUser(param, customerKeySql).then((res) => {
      result3 = res
    })
    // 整合所有的结果
    result1.forEach((item) => {
      let obj = {}
      obj.userId = item.userId
      obj.firstUserParam = item.firstUserParam
      obj.secondUserParam = item.secondUserParam
      obj.uploadType = item.uploadType
      obj.behaviorType = item.behaviorType
      obj.simpleUrl = item.simpleUrl
      obj.completeUrl = item.completeUrl
      obj.happenTime = item.happenTime
      obj.createdAt = item.createdAt
      obj.tagName = item.tagName
      obj.innerText = item.innerText
      obj.className = item.className
      obj.errorMessage = item.errorMessage
      obj.city = item.city
      obj.deviceName = item.deviceName
      obj.os = item.os
      obj.monitorIp = item.monitorIp
      result.push(obj)
    })
    result2.forEach((item) => {
      let obj = {}
      obj.userId = item.userId
      obj.firstUserParam = item.firstUserParam
      obj.secondUserParam = item.secondUserParam
      obj.uploadType = item.uploadType
      obj.behaviorType = item.behaviorType
      obj.simpleUrl = item.simpleUrl
      obj.completeUrl = item.completeUrl
      obj.happenTime = item.happenTime
      obj.createdAt = item.createdAt
      obj.tagName = item.tagName
      obj.innerText = item.innerText
      obj.className = item.className
      obj.errorMessage = item.errorMessage
      obj.city = item.city
      obj.deviceName = item.deviceName
      obj.os = item.os
      obj.monitorIp = item.monitorIp
      result.push(obj)
    })
    result3.forEach((item) => {
      let obj = {}
      obj.userId = item.userId
      obj.firstUserParam = item.firstUserParam
      obj.secondUserParam = item.secondUserParam
      obj.uploadType = item.uploadType
      obj.behaviorType = item.behaviorType
      obj.simpleUrl = item.simpleUrl
      obj.completeUrl = item.completeUrl
      obj.happenTime = item.happenTime
      obj.createdAt = item.createdAt
      obj.tagName = item.tagName
      obj.innerText = item.innerText
      obj.className = item.className
      obj.errorMessage = item.errorMessage
      obj.city = item.city
      obj.deviceName = item.deviceName
      obj.os = item.os
      obj.monitorIp = item.monitorIp
      result.push(obj)
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', result)
  }

  /**
   * 启动数据删除， 只记录最近15天的数据
   */
  static async startDelete() {
    // 每小时执行一次，如果是凌晨3 - 5点钟之间，则开始执行删除操作
    setInterval(() => {
      const hourStr = new Date().Format("hh");
      if (hourStr === "2") {
        // TODO 删除请求日志
      } else if (hourStr === "3") {
        BehaviorInfoModel.deleteBehaviorInfoFifteenDaysAgo(15)
      } else if (hourStr === "4") {
        JavascriptErrorInfoModel.deleteJavascriptErrorInfosFifteenDaysAgo(15)
      } else if (hourStr === "5") {
        CustomerPVModel.deleteCustomerPVsFifteenDaysAgo(15)
      } else if (hourStr === "6") {
        // TODO 删除截屏信息
      }
    }, 30 * 60 * 1000)
  }

  /**
   * 立邦开关
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async liBangData(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 1)
  }
}
module.exports = Common
