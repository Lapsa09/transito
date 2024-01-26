import { CitymisResponse } from '@/types/citymis.examen'
import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET(req: NextRequest) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()

    await page.goto(
      'https://citymis.co/vicentelopez/private/json/schedule_list_json' +
        req.nextUrl.search,
    )
    await page.waitForSelector('#login_panel')

    const username = await page.$("input[name='user_name']")
    await username?.type(process.env.NEXT_PUBLIC_CITYMIS_USERNAME!)
    const password = await page.$("input[name='user_password']")
    await password?.type(process.env.NEXT_PUBLIC_CITYMIS_PASSWORD!)
    await page.click("button[type='submit']")
    const data = await page
      .waitForSelector('pre')
      .then((el) => el!.getProperty('innerText'))
      .then((el) => el!.jsonValue())

    await browser.close()

    const parsedData = JSON.parse(data) as CitymisResponse
    return NextResponse.json(parsedData.content.schedule_list)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
