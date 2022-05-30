module.exports = {
    REGISTER_SMS_APP:"update sms_apps set name=$1, device_token=$2 where id=1",
    UN_REGISTER_SMS_APP:"update  sms_apps set name='', device_token='' where id=1"
}