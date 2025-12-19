import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Set-Cookie': response.headers.get('set-cookie') || '',
      }
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { message: 'Session check failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, rememberMe } = body

    // Create response
    const response = NextResponse.json({ success: true, token })

    // Set auth cookies with proper settings for deployment
    const cookieOptions = [
      `token=${token}`,
      'Path=/',
      'HttpOnly=false', // Allow client-side access
      'SameSite=Lax',
      rememberMe ? 'Max-Age=2592000' : 'Max-Age=86400', // 30 days or 1 day
    ]

    // Add Secure flag for production
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.push('Secure')
    }

    response.headers.set('Set-Cookie', cookieOptions.join('; '))

    return response
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { message: 'Session creation failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
      method: 'DELETE',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Set-Cookie': response.headers.get('set-cookie') || '',
      }
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { message: 'Session deletion failed' },
      { status: 500 }
    )
  }
}


