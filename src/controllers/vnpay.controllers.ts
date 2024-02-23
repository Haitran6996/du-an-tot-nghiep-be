/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-const */
// variantController.ts
import { NextFunction, Request, Response } from 'express'
import moment from 'moment'

function sortObject(obj: any) {
  let sorted: any = {}
  let str = []
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

export function createVnpay(req: Request, res: Response, next: NextFunction) {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  const date = new Date()
  const createDate = moment(date).format('YYYYMMDDHHmmss')

  const ipAddr = (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress || req.socket.remoteAddress

  let tmnCode = 'HOQKJBWX'
  let secretKey = 'NHRXTIWSWMLMBPARDABQQIQYGIMKKXKL'
  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
  let returnUrl = 'http://localhost:3000/'
  let orderId = req.body.orderId
  let amount = req.body.amount
  let bankCode = null

  let locale = req.body.language
  if (locale === null || locale === '') {
    locale = 'vn'
  }
  let currCode = 'VND'
  let vnp_Params: any = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = locale
  vnp_Params['vnp_CurrCode'] = currCode
  vnp_Params['vnp_TxnRef'] = orderId
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode
  }

  vnp_Params = sortObject(vnp_Params)

  let querystring = require('qs')
  let signData = querystring.stringify(vnp_Params, { encode: false })
  let crypto = require('crypto')
  let hmac = crypto.createHmac('sha512', secretKey)
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
  res.set('Content-Type', 'text/html')
  res.send(JSON.stringify(vnpUrl))
}

// export function returnVnpay(req: Request, res: Response, next: NextFunction) {
//   let vnp_Params = req.query

//   let secureHash = vnp_Params['vnp_SecureHash']

//   delete vnp_Params['vnp_SecureHash']
//   delete vnp_Params['vnp_SecureHashType']

//   vnp_Params = sortObject(vnp_Params)

//   let tmnCode = 'HOQKJBWX'
//   let secretKey = 'NHRXTIWSWMLMBPARDABQQIQYGIMKKXKL'

//   let querystring = require('qs')
//   let signData = querystring.stringify(vnp_Params, { encode: false })
//   let crypto = require('crypto')
//   let hmac = crypto.createHmac('sha512', secretKey)
//   let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

//   if (secureHash === signed) {
//     //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

//     res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
//   } else {
//     res.render('success', { code: '97' })
//   }
// }
