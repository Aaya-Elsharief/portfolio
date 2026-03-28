export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_KEY,
                name,
                email,
                subject:  subject || `Portfolio contact from ${name}`,
                message,
            })
        });

        const data = await response.json();

        if (data.success) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, message: data.message });
        }

    } catch (err) {
        console.error('Contact handler error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
