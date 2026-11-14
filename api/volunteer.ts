import { google } from 'googleapis'

const recipient = 'jabari2breezy@gmail.com'
const spreadsheetId = process.env.GOOGLE_SHEET_ID || '16gcDtan5zGQWZ1FB7CjUUUkNZXNR_4QDJDgUfxpeZ7U'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { name, email, reason } = req.body || {}
  if (![name, email, reason].every((value) => typeof value === 'string' && value.trim())) return res.status(400).json({ error: 'Please complete every field.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (!process.env.RESEND_API_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return res.status(503).json({ error: 'Volunteer submissions are not configured yet.' })

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties' })
    const tab = process.env.GOOGLE_SHEET_TAB || metadata.data.sheets?.find((sheet) => sheet.properties?.sheetId === 1931488020)?.properties?.title || metadata.data.sheets?.[0]?.properties?.title
    if (!tab) throw new Error('Volunteer sheet tab was not found.')
    const submittedAt = new Date().toISOString()
    await Promise.all([
      sheets.spreadsheets.values.append({ spreadsheetId, range: `'${tab.replace(/'/g, "''")}'!A:D`, valueInputOption: 'USER_ENTERED', requestBody: { values: [[submittedAt, name.trim(), email.trim(), reason.trim()]] } }),
      fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [recipient], reply_to: email.trim(), subject: `New Legions volunteer application — ${name.trim()}`, text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nWhy they want to volunteer:\n${reason.trim()}` }) }).then(async (response) => { if (!response.ok) throw new Error(`Email delivery failed: ${await response.text()}`) }),
    ])
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Volunteer form submission failed', error)
    return res.status(500).json({ error: 'We could not submit your application.' })
  }
}
