const axios = require('axios')
const { Telegraf } = require('telegraf')
const puppeteer = require('puppeteer')
require('dotenv').config()

async function refreshResume() {
	try {
		// открываем браузер
		const browser = await puppeteer.launch({
			// headless: false,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		})

		// открываем вкладку в браузере
		const page = await browser.newPage()

		// переходим по url адресу
		await page.goto(`https://hh.ru/account/login`)

		// делаем скриншот страницы для проверки правильности отработки программы
		// await page.screenshot({ path: 'startPage.png' })

		await page.click('.account-login-actions > button:nth-child(2)')

		// await page.screenshot({ path: 'loginPage.png' })

		await page.type(
			'div.bloko-form-item:nth-child(8) > fieldset:nth-child(1) > input:nth-child(1)',
			process.env.LOGIN
		)

		await page.type(
			'div.bloko-form-item:nth-child(9) > fieldset:nth-child(1) > input:nth-child(1)',
			process.env.PASS
		)
		// await page.screenshot({ path: 'typeUserAndPass.png' })

		await page.click('.account-login-actions > button:nth-child(1)')

		setTimeout(async () => {
			await page.goto(`https://hh.ru/applicant/resumes`)

			// await page.screenshot({ path: 'resumeList.png' })

			await page.click(
				'div.bloko-gap:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > button:nth-child(1)'
			)

			// await page.screenshot({ path: 'final.png' })

			await browser.close()
		}, '15000')
	} catch (e) {
		console.log(e)
	}
}

const bot = new Telegraf(process.env.BOT_TOKEN)

let getCtx

bot.start((ctx) => {
	ctx.reply(
		'Добро пожаловать! Тут будем обновлять Ваше резюме и присылать уведомления об успешном обновлении.'
	)
})

// сразу после запуска бота в телеграмме нужно написать 'Начать'
bot.hears('Начать', (ctx) => {
	ctx.reply('Ждите обновления резюме')
	getCtx = ctx.message.chat.id
})

function sendToBot() {
	const checkDate = new Date().getDate()
	const checkMonth = new Date().getMonth() + 1
	const checkYear = new Date().getFullYear()
	const checkHour = new Date().getHours()
	const checkMinutes = new Date().getMinutes()
	if (checkHour === 1 && checkMinutes === 43 && getCtx) {
		refreshResume()
		const messageToBot = `Резюме обновлено ${checkDate}.${checkMonth}.${checkYear} 
в ${checkHour}:${checkMinutes}`
		console.log(messageToBot)
		axios.post(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
			{
				chat_id: getCtx,
				text: messageToBot,
			}
		)
	}
}

setInterval(sendToBot, 60000)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
