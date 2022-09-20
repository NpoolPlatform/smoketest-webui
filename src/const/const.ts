// Default is procyon app id
let AppID = 'ef936d96-d8bb-40ee-a9b6-8c5af3d41bf8'

if (window.location.host.includes('.ohhash.com')) {
  AppID = 'ab7895dd-c4d1-48bd-be77-c0f255556a36'
}
if (window.location.host.includes('.procyon.vip')) {
  AppID = 'ff2c5d50-be56-413e-aba5-9c7ad888a769'
}
if (window.location.host.includes('.procyon.npool.top')) {
  AppID = 'ff2c5d50-be56-413e-aba5-9c7ad888a769'
}
if (window.location.host.includes('.ohhash.npool.top')) {
  AppID = 'ab7895dd-c4d1-48bd-be77-c0f255556a36'
}

export {
  AppID
}
