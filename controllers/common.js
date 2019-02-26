const BehaviorInfoModel = require('../modules/behaviorInfo')
const JavascriptErrorInfoModel = require('../modules/javascriptErrorInfo')
const ScreenShotInfo = require('../modules/ScreenShotInfo')
const CustomerPVModel = require('../modules/customerPV')
const LoadPageModel = require('../modules/loadPageInfo')
const IgnoreErrorModel = require('../modules/ignoreError')
const ScreenShotInfoModel = require('../modules/ScreenShotInfo')
const HttpLogInfoModel = require('../modules/HttpLogInfo')
const ExtendBehaviorInfoModel = require('../modules/extendBehaviorInfo')
const statusCode = require('../util/status-code')
const fetch = require('node-fetch')
const Utils = require('../util/utils');
const log = require("../config/log");
const fs = require('fs');
class Common {
  /**
   * 旧版上传日志的接口
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async uploadLog(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功')
  }

  /**
   * 接受并分类处理上传的日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upLg(ctx) {
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
    // 暂时先把线上的日志记录过滤掉
    const paramStr = ctx.request.body.data.replace(/": Script error\./g, "script error")
    // if (paramStr.indexOf("-qa") !== -1 || paramStr.indexOf("-staging") !== -1) {
    if (true) {
      const param = JSON.parse(paramStr)
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
          case "HTTP_LOG":
            await HttpLogInfoModel.createHttpLogInfo(logInfo);
            break;
          case "SCREEN_SHOT":
            await ScreenShotInfo.createScreenShotInfo(logInfo);
            break;
          case "CUSTOMER_PV":
            await CustomerPVModel.createCustomerPV(logInfo);
            break;
          case "LOAD_PAGE":
            await LoadPageModel.createLoadPageInfo(logInfo);
            break;
          default:
            break;
        }
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功')
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功')
    }
  }

  /**
   * 接受并分类处理上传的拓展日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async uploadExtendLog(ctx) {
    let param = {}
    if (typeof ctx.request.body !== 'object') {
      param = JSON.parse(ctx.request.body)
    } else {
      param = ctx.request.body
    }
    ExtendBehaviorInfoModel.createExtendBehaviorInfo(param)
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
    let result4 = []
    let result5 = []
    let result6 = []
    let result = []
    let pvCountList = null
    let loadPageTimeList = null
    let ipPath = ""
    let cusDetail = null
    // 查询当前用户的customerKey列表
    await CustomerPVModel.getCustomerKeyByUserId(param).then((res) => {
      res.forEach((customerKeyInfo) => {
        customerKeyList.push(customerKeyInfo.customerKey)
      })
    })
    let customerKeySql = ""
    let userIdSql = "userId='" + Utils.b64DecodeUnicode(param.searchValue) + "' "
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
      const customerKey = Utils.b64DecodeUnicode(param.searchValue)
      customerKeySql += "happenTime>" + param.happenTimeScope + " and customerKey='" + customerKey + "' "
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
    await ScreenShotInfoModel.getBehaviorsByUser(param, customerKeySql).then((res) => {
      result4 = res
    })
    await HttpLogInfoModel.getHttpLogsByUser(param, customerKeySql).then((res) => {
      result5 = res
    })
    await ExtendBehaviorInfoModel.getExtendBehaviorInfoByUserId(userIdSql).then((res) => {
      res.forEach((r) => {
        r.happenTime = new Date(r.createdAt).getTime()
      })
      result6 = res
    })
    await CustomerPVModel.getCustomerPVDetailByCustomerKey(param, customerKeySql).then((res) => {
      cusDetail = res[0]
      if (cusDetail) {
        ipPath = "http://ip.taobao.com/service/getIpInfo.php?ip=" + cusDetail.monitorIp
      }
    })
    if (ipPath) {
      try {
        await fetch(ipPath)
          .then( res => res.text())
          .then( body => {
            try {
              const obj = JSON.parse(body);
              cusDetail.province = obj.data.region || "未知";
              cusDetail.city = obj.data.city;
            } catch(e) {
              cusDetail.province = "未知";
              cusDetail.city = "未知";
            }

          });
      } catch (e) {
        cusDetail.province = "未知";
        cusDetail.city = "未知";
      }

    }
    await CustomerPVModel.getPVsByCustomerKey(param, customerKeySql).then((res) => {
      pvCountList = res
    })

    await LoadPageModel.getPageLoadTimeByCustomerKey(param, customerKeySql).then((res) => {
      loadPageTimeList = res
    })

    result = result.concat(result1, result2, result3, result5, result6)
    result4.forEach((item) => {
      item.screenInfo = (item.screenInfo || "").toString()
      result.push(item)
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', {behaviorList: result, pvCountList, loadPageTimeList, cusDetail})
  }

  /**
   * 启动数据删除， 只记录最近15天的数据
   */
  static async startDelete() {
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
