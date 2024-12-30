const userService = require('../services/userService');
const ResponseHandler = require('../utils/responseHandler');
const BaseController = require('./BaseController');
const PaginationUtils = require('../utils/paginationUtils');
const { UnauthorizedError, NotFoundError } = require('../utils/apiError');

class UserController extends BaseController {
  constructor() {
    super(userService);
  }

  /**
   * 用户注册
   */
  async register(req, res, next) {
    try {
      const user = await this.service.createUser(req.body);
      return ResponseHandler.created(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 用户登录
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const { user, accessToken, refreshToken } = await this.service.loginUser(
        email,
        password,
        userAgent,
        ipAddress
      );

      // 设置刷新令牌cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30天
      });

      return ResponseHandler.success(res, {
        user,
        accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new UnauthorizedError('请先登录');
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const { accessToken } = await this.service.refreshToken(
        refreshToken,
        userAgent,
        ipAddress
      );

      return ResponseHandler.success(res, { accessToken });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 退出登录
   */
  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      return ResponseHandler.success(res, { message: '退出登录成功' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(req, res, next) {
    try {
      const user = await this.service.getUserById(req.user.id);
      return ResponseHandler.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新当前用户信息
   */
  async updateProfile(req, res, next) {
    try {
      const user = await this.service.updateUser(req.user.id, req.body);
      return ResponseHandler.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 修改密码
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await this.service.changePassword(
        req.user.id,
        oldPassword,
        newPassword
      );
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 管理员: 获取用户列表
   */
  async getUsers(req, res, next) {
    try {
      const paginationParams = PaginationUtils.processPaginationParams(req.query);
      const filters = PaginationUtils.cleanQueryParams(req.query);
      const result = await this.service.findWithPagination(filters, paginationParams);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 管理员: 获取指定用户信息
   */
  async getUser(req, res, next) {
    try {
      const user = await this.service.findById(req.params.id);
      if (!user) {
        throw new NotFoundError('用户不存在');
      }
      return ResponseHandler.success(res, { user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController(); 