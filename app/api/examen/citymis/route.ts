import { CitymisResponse } from '@/types/citymis.examen'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { ScheduleList } from '@/types/citymis.examen'

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const [page] = await browser.pages()
    const res: ScheduleList[] = []
    let page_number = 1
    let parsedData: CitymisResponse
    do {
      await page.goto(
        `https://citymis.co/vicentelopez/private/json/schedule_list_json?page_number=${page_number}&tos_id=10&status_id=1&due_status=&date_type=schedule_date&date_range=today&process_type_id=12&`,
      )
      const login = await page.$('#login_panel')
      if (login) {
        const username = await page.$("input[name='user_name']")
        await username?.type(process.env.NEXT_PUBLIC_CITYMIS_USERNAME!)
        const password = await page.$("input[name='user_password']")
        await password?.type(process.env.NEXT_PUBLIC_CITYMIS_PASSWORD!)
        await page.click("button[type='submit']")
      }
      const data = await page
        .waitForSelector('pre')
        .then((el) => el!.getProperty('innerText'))
        .then((el) => el!.jsonValue())

      parsedData = JSON.parse(data) as CitymisResponse
      res.push(...parsedData.content.schedule_list)
    } while (parsedData.content.schedule_list.length > 0)
    await browser.close()

    return NextResponse.json(res)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
