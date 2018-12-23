const { getWechat } = require('../../wechat')

exports.getSignatureAsync = async (url) => {
  const client = getWechat()
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket, url)
  params.appId = client.appID

  console.log(params)
  console.log(ticket)

  return params
}


