const path = require('path')

const getTemplateDir = (name) => path.join(__dirname, './templates', name)

module.exports = {
  getTemplateDir
}
