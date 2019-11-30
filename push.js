var webPush = require('web-push');
     
const vapidKeys = {
   "publicKey": "BKQuDDzD3_Wd-CSpcPLIhrognPddh4GcYcB0G2m3iocXbKYqCVkAb2LRitEwv_hvAsXC6rxuDbKVF6Adl2kIq1I",
   "privateKey": "Mu-94MOhm78fph5aVGoutZiW3b7bw-J6oXt_RvQxRX4"
};
 
 
webPush.setVapidDetails(
   'mailto:zulfahmiardiansah.26@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/cuOay6fQzh8:APA91bHzOY0xZv9WPfuqTDfUGBvALyQTRbF2-quEsz_WwEk5c2Npbzu-a9VceMF0GKg1XRLQRTL-GsLkYiXNv0lQTLvVVDyGTt2l5ay8T711YJtbrOWDb3zPnA_7jnQ4Wn5tcQ4WsCdr",
   "keys": {
       "p256dh": "BN2MggVl4JKaetHrJ/99BZ1ZTtXk3ZO59Y32t2jezhmhrhh0EKJ1z8AIe4sPic8KcbpglsVSv8b9S8lLWAwYr+E=",
       "auth": "+FLUDHFWoHWPjvKkq+jIvw=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi !';
 
var options = {
   gcmAPIKey: '19018284166',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
).then((res) => {
    console.log(res)
})