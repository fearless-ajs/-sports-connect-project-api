const catchAsync = require('./../../Exceptions/catchAsync');
const AppError = require('./../../Exceptions/appError');

exports.homepage = catchAsync(async (req, res, next) => {

  // 3) Render the react page using tour data from 1)
  res.status(200).render('build/index.html', {
    title: 'Sports Padi',
  });
});

