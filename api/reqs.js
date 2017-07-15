const {Errors, ClonecordError, FieldRequiredError} = require('../errors')
module.exports.postReq = (fields, callback) => {
  return (req, res) => {
    if(!req.body) throw new FieldRequiredError(fields)
    let body = req.body
    let f = []
    for(let key in fields) {
      if(!fields.hasOwnProperty(key)) continue
      let field = fields[key]
      if(!body[field]) f.push(field)
    }
    if(f.length > 0) throw new FieldRequiredError(f)
    callback(req, res)
  }
}