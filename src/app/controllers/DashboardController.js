const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class DashboardController {
  async index (req, res) {
    const { provider } = req.session.user

    const providers = await User.findAll({ where: { provider: true } })

    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('day')
              .format()
          ]
        }
      }
    })

    if (provider === false) {
      return res.render('dashboard', { providers })
    }

    return res.render('dashboard', { appointments })
  }
}

module.exports = new DashboardController()
