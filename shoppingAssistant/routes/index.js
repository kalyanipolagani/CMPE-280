/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('Customer/start', { title: 'Express' });
};