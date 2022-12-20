const axios = require('axios')
const { Telegraf, Telegram } = require('telegraf')
const puppeteer = require('puppeteer')
require('dotenv').config()

async function refreshResume() {
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
	await page.screenshot({ path: 'startPage.png' })

	await page.click('.account-login-actions > button:nth-child(2)')

	await page.screenshot({ path: 'loginPage.png' })

	await page.type(
		'div.bloko-form-item:nth-child(8) > fieldset:nth-child(1) > input:nth-child(1)',
		process.env.LOGIN
	)

	await page.type(
		'div.bloko-form-item:nth-child(9) > fieldset:nth-child(1) > input:nth-child(1)',
		process.env.PASS
	)
	await page.screenshot({ path: 'typeUserAndPass.png' })

	await page.click('.account-login-actions > button:nth-child(1)')

	setTimeout(async () => {
		await page.goto(`https://hh.ru/applicant/resumes`)

		await page.screenshot({ path: 'resumeList.png' })

		await page.click(
			'div.bloko-gap:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > button:nth-child(1)'
		)

		await page.screenshot({ path: 'final.png' })

		await browser.close()
	}, '10000')

	// div.bloko-gap:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > button:nth-child(1) это для кнопки Поднимать автоматически

	// div.bloko-gap:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)  ==>> это "Поднять вручную можно сегодня в 21:26"

	// в браузере находим нужный элемент и копируем (прав.кнопка мыши) его селектор
	//const locationName = await page.$eval('#main_title', (el) => el.innerText)
}

function foo() {
	let currentDay = 0
	let checkNewDays = new Date().getDate()
	let checkHours = new Date().getHours()
	let checkMinutes = new Date().getMinutes()

	if (currentDay !== checkNewDays && checkHours === 8 && checkMinutes === 45) {
		refreshResume()
		// тут должен быть репорт в телеграм
	}

	if (currentDay !== checkNewDays && checkHours === 13 && checkMinutes === 5) {
		refreshResume()
		// тут должен быть репорт в телеграм
	}

	if (currentDay !== checkNewDays && checkHours === 17 && checkMinutes === 10) {
		refreshResume()
		// тут должен быть репорт в телеграм
	}

	if (currentDay !== checkNewDays && checkHours === 21 && checkMinutes === 20) {
		currentDay = checkNewDays
		refreshResume()
		// тут должен быть репорт в телеграм
	}

	// console.log(`Сегодня ${checkNewDays} число, ${checkHours}:${checkMinutes}`)
}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) =>
	ctx.reply(
		'Добро пожаловать! Тут будем обновлять Ваше резюме и присылать уведомления об успешном обновлении. Напишите Ваше имя'
	)
)

let getCtx = []
bot.on('message', (ctx) => {
	ctx.reply('Hey there')
	getCtx = [...getCtx, {chatId: ctx.message.chat.id,}]
	console.log(ctx.message.from)
	console.log(ctx.message.chat)
	console.log(getCtx)
})

function testFoo() {
	let checkMinutes = new Date().getMinutes()
	
	if (checkMinutes === 34) {
		const messageToBot = `Сейчас ${checkMinutes} минут`
		console.log(messageToBot)
		axios.get(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${getCtx}&text=${messageToBot}`
		)
	}



	if (checkMinutes === 35) {
		const messageToBot = `Сейчас ${checkMinutes} минут`
		console.log(messageToBot)
		axios.get(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${getCtx}&text=${messageToBot}`
		)
	}

	if (checkMinutes === 36) {
		const messageToBot = `Сейчас ${checkMinutes} минут`
		console.log(messageToBot)
		axios.get(
			`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${getCtx}&text=${messageToBot}`
		)
		// тут должен быть репорт в телеграм
	}
	

	// clearInterval(refresher)
}
setInterval(testFoo, 5000)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// const bot = new Telegraf(process.env.BOT_TOKEN)
// bot.start((ctx) =>
// 	ctx.reply(
// 		'Добро пожаловать! Чтобы узнать прогноз погоды в Вашем регионе - пришлите свою геолокацию'
// 	)
// )
// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))

// обработчик, который принимает от пользователя сообщение и выводит его в консоль
// bot.on('message', async (ctx) => {
// 	if (ctx.message.location) {
// 		const url = `https://api.weather.yandex.ru/v2/informers?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}`
// 		try {
// 			const response = await axios({
// 				method: 'get',
// 				url: url,
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'X-Yandex-API-Key': 'c1fec854-4a72-446f-8d2a-a9776ed55a81',
// 				},
// 			})

// 			const dataTime = new Date()
// 			const location = await getLocationName(response.data.info.url)

// 			if (location) {
// 				ctx.reply(`Ваше местоположение: ${location}`)
// 				ctx.reply(`Сегодня: ${dataTime.getDate()}-${dataTime.getMonth()}-${dataTime.getFullYear()}, ${dataTime.getHours()}:${dataTime.getMinutes()}
// Температура: ${response.data.fact.temp}
// Ощущается как: ${response.data.fact.feels_like}

// Скорость ветра: ${response.data.fact.wind_speed} м/с
// Давление: ${response.data.fact.pressure_mm} мм

// Рассвет: ${response.data.forecast.sunrise}
// Закат: ${response.data.forecast.sunset}
// `)
// 			}
// 		} catch (err) {
// 			console.error(err)
// 		}
// 	}
// })

// bot.launch()

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
