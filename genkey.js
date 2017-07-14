const randomstring = require('randomstring')
let k1 = randomstring.generate({
  charset: 'hex',
  length: 8
})
let k2 = randomstring.generate({
  charset: 'alphanumeric',
  length: 4
})
let k3 = randomstring.generate({
  charset: 'alphanumeric',
  length: 16
})
let k4 = randomstring.generate({
  charset: 'alphanumeric',
  length: 24
})
let k5 = randomstring.generate({
  charset: 'hex',
  length: 16
})
let k6 = randomstring.generate({
  charset: 'hex',
  length: 16
})
let k7 = randomstring.generate({
  charset: 'alphanumeric',
  length: 24
})

const fs = require('fs')
const path = require('path')
fs.writeFile(path.join(__dirname, 'key.json'), JSON.stringify({
  key: k1+k2+k3+'.'+k4+k5+k6+'!'+k7
}), (err) => {
  if(err) {
    console.error('Failed to write to key.json')
    return console.error(err)
  }
  console.log('Secure key is wrote to key.json')
})