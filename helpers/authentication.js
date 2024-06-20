module.exports = {
  userAuthenticated: function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'student') {
      return next()
    }
    res.redirect('/user/login')
  },
  universityAuthenticated: function(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'universityAdmin'){
      return next()
    }
    res.redirect('/user/login')
  },
  adminAuthenticated: function(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'projectAdmin'){
      return next()
    }
    res.redirect('/user/login')
  }
}

// module.exports = {
  
// }
// module.exports = {
  
// }
