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
		await axios.post(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
			{
				chat_id: getCtx,
				text: `Перешли по адресу https://hh.ru/account/login`,
			}
		)

		// делаем скриншот страницы для проверки правильности отработки программы
		await page.screenshot({ path: 'startPage.png' })
		// await bot.sendPhoto({
		// 	chat_id: getCtx,
		// 	caption: 'Стартовая страница',
		// 	photo: 'startPage.png', //replace your image url here
		// })

		await page.click(
			'#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div > div > div > div > div:nth-child(1) > div.account-login-tile-content-wrapper > div.account-login-tile-content > div > div:nth-child(2) > div > form > div.account-login-actions > button.bloko-link.bloko-link_pseudo'
		)

		await page.screenshot({ path: 'loginPage.png' })
		// await bot.sendPhoto({
		// 	chat_id: getCtx,
		// 	caption: 'Страница авторизации',
		// 	photo: 'loginPage.png', //replace your image url here
		// })

		await page.type(
			'#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div > div > div > div > div:nth-child(1) > div.account-login-tile-content-wrapper > div.account-login-tile-content > div > div:nth-child(2) > form > div:nth-child(8) > fieldset > input',
			process.env.LOGIN
		)

		await page.type(
			'#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div > div > div > div > div:nth-child(1) > div.account-login-tile-content-wrapper > div.account-login-tile-content > div > div:nth-child(2) > form > div:nth-child(9) > fieldset > input',
			process.env.PASS
		)

		await page.screenshot({ path: 'typeUserAndPass.png' })
		// await bot.sendPhoto({
		// 	chat_id: getCtx,
		// 	photo: 'typeUserAndPass.png', //replace your image url here
		// 	caption: 'Ввели логин и пароль',
		// })

		await axios.post(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
			{
				chat_id: getCtx,
				text: `Ввели логин и пароль`,
			}
		)

		await page.click(
			'#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div > div > div > div > div:nth-child(1) > div.account-login-tile-content-wrapper > div.account-login-tile-content > div > div:nth-child(2) > form > div.bloko-form-row > div > button.bloko-button.bloko-button_kind-primary'
		)

		await axios.post(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
			{
				chat_id: getCtx,
				text: `Авторизовались на сайте`,
			}
		)

		setTimeout(async () => {
			await page.setViewport({ width: 800, height: 1200 })
			await page.goto(`https://hh.ru/applicant/resumes`)
			await page.screenshot({ path: 'resumeList.png' })
			// await bot.sendPhoto({
			// 	chat_id: getCtx,
			// 	caption: 'Перешли к списку резюме',
			// 	photo: 'resumeList.png', //replace your image url here
			// })
			await axios.post(
				`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
				{
					chat_id: getCtx,
					text: `Перешли к списку резюме`,
				}
			)

			// const checkUpSelector =
			// 	'#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div > div.bloko-column.bloko-column_container.bloko-column_xs-4.bloko-column_m-8.bloko-column_l-11 > div:nth-child(4) > div:nth-child(1) > div > div.applicant-resumes-actions-wrapper > div > div > div:nth-child(1) > span > button.bloko-link'

			// await page.waitForSelector(checkUpSelector)
			// await page.click(checkUpSelector)
			// await axios.post(
			// 	`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
			// 	{
			// 		chat_id: getCtx,
			// 		text: `Обновили резюме`,
			// 	}
			// )

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
		'Добро пожаловать! Тут будем обновлять Ваше резюме и присылать уведомления об успешном обновлении. Бот работает в тестовом режиме.'
	)
})

// сразу после запуска бота в телеграмме нужно написать 'Начать'
bot.hears('Начать', (ctx) => {
	ctx.reply('Ждите обновления резюме')
	getCtx = ctx.message.chat.id
})

bot.hears('Фото', async (ctx) => {
	try {
		await ctx.replyWithPhoto(
			{ source: 'startPage.png' },
			{ caption: 'Стартовая страница' }
		)
		await ctx.replyWithPhoto({ source: 'loginPage.png' }, { caption: 'Логин' })
		await ctx.replyWithPhoto(
			{ source: 'typeUserAndPass.png' },
			{ caption: 'Ввели логин и пароль' }
		)
		await ctx.replyWithPhoto(
			{ source: 'resumeList.png' },
			{ caption: 'Список резюме' }
		)
		await ctx.replyWithPhoto(
			{ source: 'typeUserAndPass.png' },
			{ caption: 'Логин и пароль' }
		)
	} catch (e) {
		console.log(e)
	}
})

let currentDay = null
let minutes1 = 7
let minutes2 = 34
let minutes3 = 48

bot.hears('Проверка', async (ctx) => {
	await ctx.reply(`Сейчас данные приходят для чата: ${getCtx}`)
	await ctx.reply(`Текущий день: ${currentDay}`)
	await ctx.reply(`Минуты утро: ${minutes1}`)
	await ctx.reply(`Минуты день: ${minutes2}`)
	await ctx.reply(`Минуты вечер: ${minutes3}`)
})

function setRandomMinutes() {
	let min = 10
	let max = 18
	let rand = Math.floor(min + Math.random() * (max + 1 - min))
	minutes1 = rand
	minutes2 = minutes1 + 18
	minutes3 = minutes2 + 18
	axios.post(
		`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
		{
			chat_id: getCtx,
			text: `Резюме будет обновляться сегодня в 10:${minutes1}, в 14:${minutes2} и в 18:${minutes3},`,
		}
	)
}

function sendToBot() {
	try {
		const checkDay = new Date().getDay()
		const checkDate = new Date().getDate()
		const checkMonth = new Date().getMonth() + 1
		const checkYear = new Date().getFullYear()
		const checkHour = new Date().getHours()
		const checkMinutes = new Date().getMinutes()

		if (currentDay !== checkDate) {
			currentDay = checkDate
			//setRandomMinutes()
		}

		if (
			checkHour === 10 &&
			checkMinutes === minutes1 &&
			getCtx &&
			checkDay !== 0 &&
			checkDay !== 6
		) {
			refreshResume()
			const messageToBot = `Обновление запущено:
${checkDate}.${checkMonth}.${checkYear} в ${checkHour}:${checkMinutes}
		
Следующее обновление в 14:${minutes2}`
			axios.post(
				`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
				{
					chat_id: getCtx,
					text: messageToBot,
				}
			)
		}

		if (
			checkHour === 13 &&
			checkMinutes === minutes2 &&
			getCtx &&
			checkDay !== 0 &&
			checkDay !== 6
		) {
			refreshResume()
			const messageToBot = `Обновление запущено:
${checkDate}.${checkMonth}.${checkYear} в ${checkHour}:${checkMinutes}
		
Следующее обновление в 18:${minutes3}`
			axios.post(
				`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
				{
					chat_id: getCtx,
					text: messageToBot,
				}
			)
		}

		if (
			checkHour === 18 &&
			checkMinutes === minutes3 &&
			getCtx &&
			checkDay !== 0 &&
			checkDay !== 6
		) {
			refreshResume()
			const messageToBot = `Обновление запущено:
${checkDate}.${checkMonth}.${checkYear} в ${checkHour}:${checkMinutes}
		
Следующее обновление завтра утром`
			axios.post(
				`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
				{
					chat_id: getCtx,
					text: messageToBot,
				}
			)
		}
	} catch (e) {
		console.log(e)
	}
}

setInterval(sendToBot, 60000)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
