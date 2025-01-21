exports.isAuthenticated = (req, res, next) => {
  if (req.session.admin) {
    // 用戶已登入
    return next();
  } else {
    // 用戶未登入
    return res.status(401).json({ message: "尚未登入，請先登入" });
  }
};
