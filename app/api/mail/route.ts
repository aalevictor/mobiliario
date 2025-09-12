export async function POST(req: Request) {
    const body = await req.json();
    return await fetch(`${process.env.MAIL_API}/send-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}