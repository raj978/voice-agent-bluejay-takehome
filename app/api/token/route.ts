import { type NextRequest, NextResponse } from "next/server"
import { AccessToken } from "livekit-server-sdk"

export async function POST(request: NextRequest) {
  try {
    const { room, username } = await request.json()

    if (!room || !username) {
      return NextResponse.json({ error: "Room and username are required" }, { status: 400 })
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "LiveKit credentials not configured" }, { status: 500 })
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      ttl: "10m",
    })

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    })

    const token = await at.toJwt()

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating token:", error)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
