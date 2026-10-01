import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, contact, message } = body

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Simulate network delay for a real API feel
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real application, you would integrate Resend, Nodemailer, or your CRM here.
    console.log("--- New Contact Submission ---")
    console.log(`Name: ${name}`)
    console.log(`Contact: ${contact}`)
    console.log(`Message: ${message}`)
    console.log("------------------------------")

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
