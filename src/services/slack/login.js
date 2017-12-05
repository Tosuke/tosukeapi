import client from 'cheerio-httpcli'

export default function login(team, email, password) {
  return client
    .fetch(`https://${team}.slack.com`)
    .then(res => {
      if (res.$('title').text() !== 'Slack') throw new Error('invalid team')
      return res
        .$('form#signin_form')
        .attr('accept-charset', 'utf8')
        .submit({
          email,
          password,
        })
    })
    .then(res => {
      const body = res.body
      return {
        api_token: getProp('api_token', body),
        user_id: getProp('user_id', body),
        team_id: getProp('team_id', body)
      }
    })
}

function getProp(needle, haystack) {
  const reg = new RegExp(`${needle}\\s*:\\s*["'](.*)["']`)
  return JSON.parse(`"${reg.exec(haystack)[1]}"`)
}
