const {Errors, ClonecordError, FieldRequiredError} = require('./errors')
module.exports.postReq = (fields, callback) => {
  return (req, res, next) => {
    if(!req.body) throw new FieldRequiredError(fields)
    let body = req.body
    let f = []
    for(let key in fields) {
      if(!fields.hasOwnProperty(key)) continue
      let field = fields[key]
      if(!body[field]) f.push(field)
    }
    if(f.length > 0) throw new FieldRequiredError(f)
    Promise.resolve(callback(req, res)).catch((err) => {
      return next(err)
    })
  }
}