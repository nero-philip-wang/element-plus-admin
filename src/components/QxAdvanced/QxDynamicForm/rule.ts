const required = { required: true, message: '必填' }

const mobile = {
  validator: (rule: any, value: string): boolean => !value || /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value),
  message: '请输入正确手机号',
}
const idNo18 = {
  validator: (rule: any, value: number) =>
    !value || /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(String(value)),
  message: '请输入正确的身份证号',
}

const rangeRequired = {
  required: true,
  validator: (rule: any, value: any): boolean => {
    return !!((value.start || value.startTime) && (value.end || value.endTime))
  },
  message: '必填',
}

export default { required, mobile, idNo18, rangeRequired }
