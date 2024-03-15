const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

const generateJwt = (id, email, timezone) => {
    return jwt.sign(
        {id, email, timezone}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}
const getUserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone; // метод позволяет получить текущий часовой пояс браузера пользователя
  };
class UserController {
    async registration(req, res, next) {
        const userTimeZone = getUserTimeZone(); // возвращает текущий часовой пояс пользователя
        const {email, password} = req. body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPasswod = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPasswod, timezone: userTimeZone})
        const token = generateJwt(user.id, user.email, user.timezone)
        // console.log(user.timezone)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.timezone)
        // console.log(user.timezone)
        return res.json({token})
    }

    async check(req, res) {
        const {id, email, timezone} = req.user
        // console.log(req.user)
        // console.log(id, email, timezone);
        return res.json({id, email, timezone})
    }
}

module.exports = new UserController()