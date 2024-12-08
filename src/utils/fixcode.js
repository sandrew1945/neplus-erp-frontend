const codeData = {
  data: [
    { fixcodeId: '10011001', type: '1001', typeName: '状态', codeDesc: '有效' },
    { fixcodeId: '10011002', type: '1001', typeName: '状态', codeDesc: '无效' },
    { fixcodeId: '10021001', type: '1002', typeName: '性别', codeDesc: '男' },
    { fixcodeId: '10021002', type: '1002', typeName: '性别', codeDesc: '女' },
    { fixcodeId: '10021003', type: '1002', typeName: '性别', codeDesc: '未知' },
    { fixcodeId: '10031001', type: '1003', typeName: '是否', codeDesc: '是' },
    { fixcodeId: '10031002', type: '1003', typeName: '是否', codeDesc: '否' },
    { fixcodeId: '20011001', type: '2001', typeName: '员工状态', codeDesc: '在职' },
    { fixcodeId: '20011002', type: '2001', typeName: '员工状态', codeDesc: '离职' },
    { fixcodeId: '20011003', type: '2001', typeName: '员工状态', codeDesc: '退休' },
    { fixcodeId: '20011004', type: '2001', typeName: '员工状态', codeDesc: '离岗退养' },
    { fixcodeId: '20021001', type: '2002', typeName: '公司类型', codeDesc: 'Eenmanzaak' },
    { fixcodeId: '20021002', type: '2002', typeName: '公司类型', codeDesc: 'B.V.' },
    { fixcodeId: '20031001', type: '2003', typeName: '申报周期', codeDesc: '月报' },
    { fixcodeId: '20031002', type: '2003', typeName: '申报周期', codeDesc: '季报' },
    { fixcodeId: '20041001', type: '2004', typeName: '角色类型', codeDesc: '系统管理' },
    { fixcodeId: '20041002', type: '2004', typeName: '角色类型', codeDesc: '公司管理' },
    { fixcodeId: '20041003', type: '2004', typeName: '角色类型', codeDesc: '公司员工' },
    { fixcodeId: '20051001', type: '2005', typeName: '任务类型', codeDesc: '月度任务' },
    { fixcodeId: '20051002', type: '2005', typeName: '任务类型', codeDesc: '季度任务' },
    { fixcodeId: '20051003', type: '2005', typeName: '任务类型', codeDesc: '年度任务' },
    { fixcodeId: '20061001', type: '2006', typeName: '任务状态', codeDesc: '未处理' },
    { fixcodeId: '20061002', type: '2006', typeName: '任务状态', codeDesc: '账务处理' },
    { fixcodeId: '20061003', type: '2006', typeName: '任务状态', codeDesc: '自审完成' },
    { fixcodeId: '20061004', type: '2006', typeName: '任务状态', codeDesc: '审核通过' },
    { fixcodeId: '20061005', type: '2006', typeName: '任务状态', codeDesc: '草稿发送' },
    { fixcodeId: '20061006', type: '2006', typeName: '任务状态', codeDesc: '内部驳回' },
    { fixcodeId: '20061007', type: '2006', typeName: '任务状态', codeDesc: '等待申报' },
    { fixcodeId: '20061008', type: '2006', typeName: '任务状态', codeDesc: '外部驳回' },
    { fixcodeId: '20061009', type: '2006', typeName: '任务状态', codeDesc: '提交申报' }

  ]
}

/**
 *  获取fixcode描述
 * @param {*} fixcodeId
 */
export function getfixCodeDesc (fixcodeId) {
  if (fixcodeId != null && fixcodeId !== '') {
    const allCode = codeData.data
    let result = ''
    allCode.some((item, index) => {
      if (typeof (fixcodeId) === 'number') {
        fixcodeId = '' + fixcodeId
      }
      if (fixcodeId === allCode[index].fixcodeId) {
        result = allCode[index].codeDesc
        return true
      }
    })
    return result
  } else {
    return ''
  }
}

/**
 *  根据fixcode类型获取全部fixcode
 * @param {*} type
 */
export function getSelectOption (type) {
  const allCode = codeData.data
  const options = []
  allCode.forEach((item, index) => {
    if (allCode[index].type === type) {
      options.push({ key: item.fixcodeId, value: item.codeDesc })
    }
  })
  return options
}
