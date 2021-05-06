import puppeteer from "puppeteer"

const browser = await puppeteer.launch({ headless: false })
const tab = ( await browser.pages() )[0]

const seenWords = new Array()
let currentWord = ""

await tab.goto("https://humanbenchmark.com/tests/verbal-memory", { waitUntil: "domcontentloaded" })
await tab.waitForTimeout(3000)

const [startButton] = await tab.$x("//button[contains(., 'Start')]")
await startButton.click()
await tab.waitForTimeout(1000)

const [seenButton] = await tab.$x("//button[contains(., 'SEEN')]")
const [newButton] = await tab.$x("//button[contains(., 'NEW')]")

async function getCurrentWord() {
    return tab.evaluate(() => document.querySelector('.word').textContent)
}

async function botDecisionLoop() {

    currentWord = await getCurrentWord()

    if (seenWords.includes(currentWord)) {
        await seenButton.click()
    } else {
        seenWords.push(currentWord)
        await newButton.click()
    }

    await tab.waitForTimeout(50)
    await botDecisionLoop()

}

await botDecisionLoop()