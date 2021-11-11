import dotenv from "dotenv"
dotenv.config()
import fetch from "node-fetch"
import express from "express"
import cryptoJS from "crypto-js"
const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const apiPathSubmit = 'v2/auth/w/order/submit'
const SERVER_SUBMIT_ORDER_PORT = process.env.SERVER_SUBMIT_ORDER_PORT
const app = express()

import {submitLog, errorLog, debugLog, defaultLog} from './loggingConf.js'

app.post('/submit', (req, res) => {
    let postBodyRequest = ''
    req.on('data', chunk => {
        postBodyRequest += chunk.toString()
    });

    req.on('end', ()=>{
        let params = JSON.parse(postBodyRequest)
        submitLog.info("params: ", params )
        let orderType = params.type
        let pair = params.pair
        let amount = params.volume
        let nonce = (Date.now() * 1000).toString()
        let body = {
            type: orderType,
            symbol: pair,
            amount: amount
        }
        submitLog.info('body: ', body)

        let signature = `/api/${apiPathSubmit}${nonce}${JSON.stringify(body)}`
        let sig = cryptoJS.HmacSHA384(signature, apiSecret).toString()


        fetch(`https://api.bitfinex.com/${apiPathSubmit}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'bfx-nonce': nonce,
                'bfx-apikey': apiKey,
                'bfx-signature': sig
            }
        })
            .then(res => res.json())
            .then(json => res.end(Buffer.from(JSON.stringify(json)))) // !!!!Возращает
            .then(json => debugLog.debug(json))
            .catch(err => {
                errorLog.error(err, "Response error")
            })

    })
})

app.listen(SERVER_SUBMIT_ORDER_PORT,() => {
    console.log('Server has been started on port', + SERVER_SUBMIT_ORDER_PORT, '...')
})