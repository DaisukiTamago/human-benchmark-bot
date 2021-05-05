import puppeteer from 'puppeteer'


(async () => {
    const wordsList = []
    //const browserWSEndpoint = "ws://127.0.0.1:2222/devtools/browser/c9a9b42e-4b40-4d5d-91c9-b43b026b7c7b"
    const browser = await puppeteer.launch({ headless: false })
    const newTab = await browser.newPage()

    const page = await newTab.goto("https://humanbenchmark.com/tests/verbal-memory", { waitUntil: 'domcontentloaded' })

    console.log(page.statusText())
    console.log(page.status())

    if (page.status()) {
        console.log('waiting...')
        await newTab.waitForTimeout(3000)
        //await newTab.screenshot({path: "scr.png"})


        console.log('searching for start button...')
        const startButton = (await newTab.$$('button'))[1]
        console.log('clicking start button...')
        await startButton.click()

        console.log('waiting....')
        await newTab.waitForTimeout(2000)

        console.log('looking for word container...')
        console.log('capturing buttons...')
        const [seenButton] = await newTab.$x("//button[contains(., 'SEEN')]")
        const [newButton] = await newTab.$x("//button[contains(., 'NEW')]")

        async function getNewWord() {
            console.log("fetching new word....")
            return newTab.evaluate(() => {
                let wordValue = document.querySelector('.word').textContent
                return wordValue
            })
        }

        async function bot() {

            const word = await getNewWord()

            if (wordsList.length == 0) {

                wordsList.push(word)
                await newButton.click()

            } else {

                if (wordsList.includes(word)) {

                    await seenButton.click()

                } else {

                    await newButton.click()
                    wordsList.push(word)
                }
            }

            await newTab.waitForTimeout(1000)
            console.log('list: ', wordsList)
            await bot()
        }


        await bot()


    } else {
        console.log("Unable to load webpage")
    }


    browser.disconnect()

})()