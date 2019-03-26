const { User, Appointment } = require('../models')
const moment = require('moment')
const { Op } = require('sequelize')

class ScheduleController {
  async index (req, res) {
    const date = moment(parseInt(req.params.date))

    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    if (date.format('D/MM/Y') !== moment().format('D/MM/Y')) {
      return res.render('schedule/index', { appointments })
    }
  }
}

module.exports = new ScheduleController()
